import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://syllabus.examarchive.dev"),
  title: {
    default: "Syllabus Vault | ExamArchive",
    template: "%s | Syllabus Vault",
  },
  description: "Community-driven syllabus repository for FYUGP students. Browse, verify, and submit structured course syllabi for Assam University and affiliated colleges.",
  keywords: ["syllabus vault", "FYUGP syllabus", "Assam University syllabus", "course syllabus", "ExamArchive"],
  icons: {
    icon: [{ url: '/branding/logo.png', type: 'image/png' }],
    apple: '/branding/logo.png',
    shortcut: '/branding/logo.png',
  },
  openGraph: {
    type: "website",
    siteName: "ExamArchive",
    title: "Syllabus Vault | ExamArchive",
    description: "Browse and contribute structured FYUGP course syllabi.",
    url: "https://syllabus.examarchive.dev",
    images: [{ url: "/branding/logo.png", width: 512, height: 512, alt: "ExamArchive Syllabus Vault" }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
