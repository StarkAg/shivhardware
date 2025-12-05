'use client'

import SmoothScroll from '@/components/SmoothScroll'
import CursorFollower from '@/components/CursorFollower'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <CursorFollower />
        <Header />
        <main className="flex flex-col min-h-screen">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </ThemeProvider>
  )
}
