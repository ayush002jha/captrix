import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captrix - Caption Studio",
  description: "Upload a short clip, style captions, and export a caption kit."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
