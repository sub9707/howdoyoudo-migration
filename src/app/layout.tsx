// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '../styles/globals.css'
import PageTransition from '@/components/ui/PageTransition'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'HOWDOYOUDO | Creative Studio',
    template: '%s | HOWDOYOUDO'
  },
  description: 'Welcome to HOWDOYOUDO - Creative studio and digital experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <PageTransition>
          <div className="min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </PageTransition>
      </body>
    </html>
  )
}