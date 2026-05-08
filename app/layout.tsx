import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smooth, Draggable Product Grid | Codrops',
  description: 'Smooth, draggable product grid with GSAP',
  icons: {
    icon: '/logos/white.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="loading">{children}</body>
    </html>
  )
}
