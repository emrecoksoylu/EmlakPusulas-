import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emlakpusulasi.com"),
  title: "EmlakPusulası - Gayrimenkul Yönetim Paneli",
  description: "Emlak danışmanları için geliştirilmiş portföy takip, müşteri yönetimi ve sözleşme hazırlama asistanı. İşinizi dijitalleştirin.",
  keywords: ["emlak", "gayrimenkul", "emlak programı", "crm", "portföy yönetimi", "emlak asistanı", "konut", "arsa", "emlak ofisi yazılımı"],
  authors: [{ name: "EmlakPusulası Team" }],
  openGraph: {
    title: "EmlakPusulası - Akıllı Emlak Asistanınız",
    description: "Portföyünüzü ve müşterilerinizi tek yerden yönetin. Profesyonel sözleşmeler hazırlayın.",
    url: "https://emlakpusulası.com",
    siteName: "EmlakPusulası",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmlakPusulası",
    description: "Emlakçılar için hepsi bir arada yönetim paneli.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
