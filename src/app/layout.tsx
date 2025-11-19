// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'
import { TransitionProvider } from '@/context/TransitionContext'
import '../styles/globals.css'

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
        <TransitionProvider>
          <div className="min-h-screen">
            <Header />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
          </div>
        </TransitionProvider>
      </body>
    </html>
  )
}