import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const unbounded = Unbounded({
  variable: "--font-outfit",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "WebPro.kg — Премиальные сайты для бизнеса в Кыргызстане",
  description: "Создаём шедевры веб-дизайна для бизнеса в Кыргызстане. Космический дизайн, интерактивные эффекты, WhatsApp-интеграция.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${unbounded.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0d15] text-[#f1f5f9]">{children}</body>
    </html>
  );
}
