import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/edu/navigation"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
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
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-sans), 'Noto Sans JP', sans-serif" }}
      >
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
