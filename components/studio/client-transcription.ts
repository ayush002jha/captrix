import type { CaptionSegment } from "./types";

type ProgressStatus = {
  status?: string;
  file?: string;
  progress?: number;
};

type AsrChunk = {
  text?: string;
  timestamp?: [number | null, number | null];
};

type AsrOutput = {
  text?: string;
  chunks?: AsrChunk[];
  segments?: Array<{
    id?: string;
    text?: string;
    start?: number;
    end?: number;
    startSeconds?: number;
    endSeconds?: number;
  }>;
};

type Transcriber = (audio: string, options?: Record<string, unknown>) => Promise<AsrOutput>;

const MODEL_ID = "Xenova/whisper-tiny.en";
const FREE_HOSTED_MULTILINGUAL_ENDPOINT = "https://api-inference.huggingface.co/models/openai/whisper-small";
const WORDS_PER_SEGMENT = 8;
let transcriberPromise: Promise<Transcriber> | null = null;

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function clampTime(value: number, duration: number) {
  return Math.max(0, Math.min(duration, Number(value.toFixed(2))));
}

function visibleCaptionEnd(start: number, fallbackEnd: number, text: string, duration: number) {
  const wordCount = cleanText(text).split(/\s+/).filter(Boolean).length;
  const estimatedReadingTime = Math.max(0.9, Math.min(3.4, wordCount * 0.36 + 0.55));
  return clampTime(Math.min(fallbackEnd, start + estimatedReadingTime), duration);
}

function splitChunkIntoSegments(text: string, start: number, end: number, duration: number, prefix: string) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const safeStart = clampTime(start, duration);
  const safeEnd = clampTime(Math.max(end, safeStart + 1.2), duration);
  const chunkDuration = Math.max(1.2, safeEnd - safeStart);
  const groups: CaptionSegment[] = [];

  for (let index = 0; index < words.length; index += WORDS_PER_SEGMENT) {
    const slice = words.slice(index, index + WORDS_PER_SEGMENT);
    const ratioStart = index / words.length;
    const ratioEnd = Math.min(1, (index + slice.length) / words.length);
    groups.push({
      id: `${prefix}-${groups.length + 1}`,
      text: slice.join(" "),
      start: clampTime(safeStart + chunkDuration * ratioStart, duration),
      end: visibleCaptionEnd(
        clampTime(safeStart + chunkDuration * ratioStart, duration),
        clampTime(safeStart + chunkDuration * ratioEnd, duration),
        slice.join(" "),
        duration
      )
    });
  }

  return groups;
}

function segmentsFromTranscript(output: AsrOutput, duration: number) {
  if (output.segments?.length) {
    return output.segments
      .map((segment, index) => {
        const start = segment.start ?? segment.startSeconds ?? index * 3;
        const end = segment.end ?? segment.endSeconds ?? start + 3;

        return {
          id: segment.id ?? `hosted-${index + 1}`,
          text: cleanText(segment.text ?? ""),
          start: clampTime(start, duration),
          end: visibleCaptionEnd(clampTime(start, duration), clampTime(Math.max(end, start + 0.8), duration), segment.text ?? "", duration)
        };
      })
      .filter((segment) => segment.text.length > 0);
  }

  const chunks = output.chunks?.filter((chunk) => cleanText(chunk.text ?? "").length > 0) ?? [];

  if (chunks.length > 0) {
    return chunks.flatMap((chunk, index) => {
      const [chunkStart, chunkEnd] = chunk.timestamp ?? [index * 4, index * 4 + 4];
      return splitChunkIntoSegments(
        chunk.text ?? "",
        typeof chunkStart === "number" ? chunkStart : index * 4,
        typeof chunkEnd === "number" ? chunkEnd : index * 4 + 4,
        duration,
        `ai-${index + 1}`
      );
    });
  }

  return splitChunkIntoSegments(output.text ?? "", 0, Math.min(duration, 8), duration, "ai-1");
}

async function getTranscriber(onStatus: (message: string) => void) {
  if (!transcriberPromise) {
    transcriberPromise = import("@huggingface/transformers").then(async ({ env, pipeline }) => {
      env.allowLocalModels = false;
      env.allowRemoteModels = true;
      env.useBrowserCache = true;

      return pipeline("automatic-speech-recognition", MODEL_ID, {
        dtype: "fp32",
        progress_callback: (progress: ProgressStatus) => {
          if (progress.status === "progress" && typeof progress.progress === "number") {
            onStatus(`Preparing caption engine ${Math.round(progress.progress)}%`);
            return;
          }

          if (progress.status === "download" && progress.file) {
            onStatus(`Downloading ${progress.file}`);
            return;
          }

          if (progress.status === "ready") {
            onStatus("Caption engine ready.");
          }
        }
      }) as Promise<Transcriber>;
    });
  }

  return transcriberPromise;
}

async function generateHostedCaptionSegments(
  endpoint: string,
  file: File,
  duration: number,
  onStatus: (message: string) => void,
  mode: "form" | "huggingface"
) {
  let response: Response;

  if (mode === "huggingface") {
    onStatus("Preparing speech recognition...");
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-wait-for-model": "true"
      },
      body: await file.arrayBuffer()
    });
  } else {
    const form = new FormData();
    form.set("file", file);
    form.set("duration", String(duration));

    onStatus("Analyzing speech...");
    response = await fetch(endpoint, {
      method: "POST",
      body: form
    });
  }


  if (!response.ok) {
    throw new Error("Caption generation service is temporarily unavailable.");
  }

  const output = (await response.json()) as AsrOutput;
  const segments = segmentsFromTranscript(output, duration).slice(0, 24);

  if (segments.length === 0) {
    throw new Error("No usable captions were found in this clip.");
  }

  return segments;
}

export async function generateClientCaptionSegments(
  audioUrl: string,
  file: File,
  duration: number,
  onStatus: (message: string) => void
) {
  const customHostedEndpoint = process.env.NEXT_PUBLIC_CAPTRIX_TRANSCRIBE_ENDPOINT?.trim();
  const hostedAttempts = customHostedEndpoint
    ? [{ endpoint: customHostedEndpoint, mode: "form" as const }]
    : [{ endpoint: FREE_HOSTED_MULTILINGUAL_ENDPOINT, mode: "huggingface" as const }];

  for (const attempt of hostedAttempts) {
    try {
      const hostedSegments = await generateHostedCaptionSegments(attempt.endpoint, file, duration, onStatus, attempt.mode);
      onStatus("Captions are ready to edit.");
      return hostedSegments;
    } catch (error) {
      onStatus(
        error instanceof Error
          ? `${error.message} Trying another captioning method.`
          : "Trying another captioning method."
      );
    }
  }

  onStatus("Preparing speech recognition...");
  const transcriber = await getTranscriber(onStatus);
  onStatus("Analyzing speech...");

  const output = await transcriber(audioUrl, {
    return_timestamps: true,
    chunk_length_s: 30,
    stride_length_s: 5
  });

  return segmentsFromTranscript(output, duration).slice(0, 24);
}
