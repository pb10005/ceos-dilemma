import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "CEO's Dilemma",
  description: '企業経営シミュレーション戦略ゲーム'
}

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
