import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
  keywords: ['creative', 'studio', 'design', 'digital'],
  authors: [{ name: 'HOWDOYOUDO' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://howdoyoudo.com',
    siteName: 'HOWDOYOUDO',
    title: 'HOWDOYOUDO | Creative Studio',
    description: 'Welcome to HOWDOYOUDO - Creative studio and digital experiences',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          <Header />
          <main>
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  )
}