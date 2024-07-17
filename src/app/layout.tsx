import type { Metadata } from 'next'
import { Volkhov } from 'next/font/google'
import '../../styles/globals.css'
import { AOSInit } from './components/AOS'

const raleway = Volkhov({
  subsets: ['latin'],
  weight: '700'
})

export const metadata: Metadata = {
  title: 'Travel.ai',
  description: 'A Travel AI Agency Landing Page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AOSInit />
      <body className={raleway.className}>{children}</body>
    </html>
  )
}
