import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "TrustFlow — Collect Testimonials, Import Reviews, Display Everywhere",
    template: "%s | TrustFlow",
  },
  description:
    "The affordable social proof platform. Collect testimonials, import Google & Trustpilot reviews, and display beautiful widgets on your website. Free plan available. From £12/month.",
  openGraph: {
    title: "TrustFlow — Social Proof Platform",
    description:
      "Collect testimonials. Import reviews. Display everywhere. From £12/month.",
    type: "website",
    url: "https://trustflow-liard.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustFlow — Social Proof Platform",
    description:
      "Collect testimonials. Import reviews. Display everywhere. From £12/month.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            },
          }}
        />
      </body>
    </html>
  );
}
