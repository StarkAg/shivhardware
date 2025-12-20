'use client'

import SmoothScroll from '@/components/SmoothScroll'
import CursorFollower from '@/components/CursorFollower'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <ScrollToTop />
        <SmoothScroll>
          <CursorFollower />
          <Header />
          <main className="flex flex-col min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </CartProvider>
    </ThemeProvider>
  )
}
