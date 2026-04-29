import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/edu/navigation"
import { MotionProvider } from "@/components/edu/motion-provider"
import { WebsiteJsonLd } from "@/components/edu/json-ld"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Eternal Dominion Universe — 統合時空構造書 v3.0",
  description: "E16連星系から地球AD2026へ — AURALIS 地球2026交信プロジェクト設定書 v2.0",
  keywords: [
    "Eternal Dominion",
    "EDU",
    "AURALIS",
    "Liminal Forge",
    "E16連星系",
    "SF",
    "ユニバース",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "1024x1024" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <WebsiteJsonLd />
      <a href="#main-content" className="skip-link">
        メインコンテンツへスキップ
      </a>
      <body
        className={`${notoSansJP.variable} font-sans`}
        style={{ fontFamily: "var(--font-sans), 'Noto Sans JP', sans-serif" }}
      >
        <Navigation />
        <div id="main-content">
          <MotionProvider>{children}</MotionProvider>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
