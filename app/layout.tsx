import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shirtz — Apparel, Accessories, and More',
  description: 'Browse and explore our T-shirt grid — drag, zoom in on details, and shop each piece.',
  icons: {
    icon: '/logos/white.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
