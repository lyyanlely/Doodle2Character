import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Doodle to Character AI',
  description: 'Draw something, pick a style, and let AI bring it to life!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-900 text-gray-100`}>
        {children}
      </body>
    </html>
  )
} 