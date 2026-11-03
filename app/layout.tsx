import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lara Consultancy | Academic Support for Students",
  description:
    "Practical academic guidance, research support, proofreading, and subject-specific help from Lara Consultancy.",
  applicationName: "Lara Consultancy",
  openGraph: {
    title: "Lara Consultancy | Academic Support for Students",
    description: "Practical academic guidance, research support, proofreading, and subject-specific help from Lara Consultancy.",
    url: siteUrl,
    siteName: "Lara Consultancy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
