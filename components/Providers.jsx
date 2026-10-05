'use client'

import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import CursorFollower from '@/components/CursorFollower'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'

// The guarantee card served through the QR short link (gcvf.vercel.app/<number>/<secret>):
// the browser's address is that, not /Gaurantee/..., so the path alone would bring the
// shop's header and footer back around a card that must not name the shop.
const CARD_SHORT_PATH = /^\/GC-[A-Za-z0-9-]+\/[A-Z0-9]{8,64}\/?$/

export default function Providers({ children }) {
  const pathname = usePathname()
  // The route actually rendered, whatever the address bar shows.
  const segment = useSelectedLayoutSegment()

  // Catalogue pages and the public guarantee-card view are standalone.
  // Strip all site chrome: no header, footer, smooth-scroll or cursor follower.
  if (
    pathname?.startsWith('/catalogs') ||
    pathname?.startsWith('/Gaurantee') ||
    segment === 'Gaurantee' ||
    CARD_SHORT_PATH.test(pathname || '')
  ) {
    return children
  }

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
