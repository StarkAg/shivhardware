import PwaRegister from './PwaRegister'

export const metadata = {
  manifest: '/catalogs/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Catalogues',
  },
  icons: {
    apple: '/catalogs/apple-touch-icon.png',
  },
}

export const viewport = {
  themeColor: '#0b0b0b',
}

export default function CatalogsLayout({ children }) {
  return (
    <>
      <PwaRegister />
      {children}
    </>
  )
}
