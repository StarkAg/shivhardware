declare module '@/components/Hero' {
  import { ReactNode } from 'react'
  
  interface HeroProps {
    title?: string
    subtitle?: string
    mediaType?: 'image' | 'video' | 'carousel'
    mediaSrc?: string | Array<{ type: 'video' | 'image'; src: string; poster?: string }>
    ctas?: Array<{ text: string; href: string; variant?: string }>
    kicker?: string
    rotatingWords?: string[]
  }
  
  const Hero: React.FC<HeroProps>
  export default Hero
}

