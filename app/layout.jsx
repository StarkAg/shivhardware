import '../styles/globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import CursorFollower from '@/components/CursorFollower'
import Header from '@/components/Header'

export const metadata = {
  title: 'Shiv Hardware Store — Premium Hardware Solutions',
  description: 'Complete hardware solutions for modern builders. Configure custom doors and windows in seconds. Get accurate pricing and quotes for your construction projects in Ramgarh, Jharkhand.',
  keywords: ['hardware', 'aluminium doors', 'windows', 'calculators', 'Shiv Hardware', 'Ramgarh'],
  authors: [{ name: 'Shiv Hardware Store' }],
  creator: 'Shiv Hardware Store',
  publisher: 'Shiv Hardware Store',
  
  // OpenGraph metadata (used by WhatsApp, Instagram, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shivhardware.com', // TODO: Replace with actual domain
    siteName: 'Shiv Hardware Store',
    title: 'Shiv Hardware Store — Premium Hardware Solutions',
    description: 'Complete hardware solutions for modern builders. Configure custom doors and windows with accurate pricing calculators.',
    images: [
      {
        url: '/White Logo.png', // Logo used for social previews
        width: 800,
        height: 800,
        alt: 'Shiv Hardware Store logo',
      },
    ],
  },

  // Twitter / X Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Shiv Hardware Store — Premium Hardware Solutions',
    description: 'Complete hardware solutions for modern builders. Configure custom doors and windows with accurate pricing calculators.',
    images: ['/White Logo.png'],
    creator: '@shivhardware', // TODO: Replace with actual Twitter handle
  },

  // Canonical URL
  alternates: {
    canonical: 'https://stara.com', // TODO: Replace with actual domain
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Viewport (exported separately in Next.js 15+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b0b0b',
}

// Structured JSON-LD data for organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shiv Hardware Store',
  url: 'https://shivhardware.com', // TODO: Replace with actual domain
  logo: 'https://shivhardware.com/White%20Logo.png',
  sameAs: [],
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+91-80928-50954',
    contactType: 'customer service',
    areaServed: 'IN',
  }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Inter font loaded via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Favicon / app icon */}
        <link rel="icon" href="/assets/Favicon.png" type="image/png" />
        
        {/* Preload critical hero assets for faster LCP */}
        <link rel="preload" as="image" href="/assets/hero-1.jpg" />
        <link rel="preload" as="image" href="/assets/hero-video-frame.jpg" />
      </head>
      <body className="font-sans">
        <SmoothScroll>
          <CursorFollower />
          {/* Structured JSON-LD Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <Header />
          <main>
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  )
}