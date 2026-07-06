import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captrix AI - Caption Studio",
  description: "Turn short videos into share-ready clips with animated AI captions."
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
