import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger if not already registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * GSAP Animation Configuration Helper
 * 
 * Centralized configuration for GSAP animations across the site.
 * Adjust these values to tune animation feel and timing.
 */

// Default animation settings
export const animationDefaults = {
  // Default duration for most animations
  duration: 0.8,
  
  // Default easing function
  ease: 'power3.out',
  
  // Stagger delay between items in staggered animations
  stagger: 0.1,
  
  // ScrollTrigger start position (percentage of viewport)
  scrollStart: 'top 85%',
  
  // Parallax intensity (higher = more movement)
  parallaxIntensity: 100,
}

// Check if Lenis is initialized (for ScrollTrigger proxy)
function isLenisActive() {
  if (typeof window === 'undefined') return false
  // Check if lenis instance exists (will be set by scroll.js)
  return window.__lenis !== undefined
}

/**
 * Create a fade-in animation with optional translate
 * @param {HTMLElement|HTMLElement[]} target - Element(s) to animate
 * @param {Object} options - Animation options
 */
export function fadeIn(target, options = {}) {
  const {
    y = 30,
    duration = animationDefaults.duration,
    ease = animationDefaults.ease,
    delay = 0,
  } = options

  return {
    from: {
      opacity: 0,
      y,
    },
    to: {
      opacity: 1,
      y: 0,
      duration,
      ease,
      delay,
    },
  }
}

/**
 * Create a staggered reveal animation
 * @param {HTMLElement[]} targets - Array of elements to animate
 * @param {Object} options - Animation options
 */
export function staggeredReveal(targets, options = {}) {
  const {
    y = 40,
    duration = animationDefaults.duration,
    ease = animationDefaults.ease,
    stagger = animationDefaults.stagger,
    scrollTrigger = null,
  } = options

  return {
    from: {
      opacity: 0,
      y,
    },
    to: {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      scrollTrigger,
    },
  }
}

/**
 * Disable Lenis on mobile devices
 * Call this in lib/scroll.js initScroll function
 */
export function shouldDisableLenis() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 700
}

/**
 * Enable ScrollTrigger markers for debugging
 * Set to true during development to see trigger points
 */
export const DEBUG_SCROLL_TRIGGERS = false

/**
 * Hero intro animation - polished timeline with mask reveal
 * @param {HTMLElement} heroEl - Hero section element
 * @returns {gsap.core.Timeline} GSAP timeline
 */
export function heroIntro(heroEl) {
  if (!heroEl) return null

  const tl = gsap.timeline()
  const title = heroEl.querySelector('h1')
  const subtitle = heroEl.querySelector('p')
  const ctas = heroEl.querySelectorAll('a[href]')

  // Title animation with subtle mask reveal using overflow + transform
  if (title) {
    // Set initial state
    gsap.set(title, {
      opacity: 0,
      y: 30,
      clipPath: 'inset(0 100% 0 0)', // Mask from left
    })

    tl.to(title, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    })
  }

  // Subtitle fade-in
  if (subtitle) {
    tl.to(
      subtitle,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.6'
    )
  }

  // CTA buttons with stagger
  if (ctas.length > 0) {
    tl.fromTo(
      ctas,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      },
      '-=0.5'
    )
  }

  return tl
}

/**
 * Hero parallax effect for background media
 * @param {HTMLElement} mediaEl - Media element (video or image container)
 * @param {HTMLElement} triggerEl - ScrollTrigger trigger element (usually hero section)
 * @returns {gsap.core.ScrollTrigger} ScrollTrigger instance
 */
export function heroParallax(mediaEl, triggerEl) {
  if (!mediaEl || !triggerEl) return null

  // Guard: Only use Lenis proxy if Lenis is active
  const scrollTriggerOptions = {
    trigger: triggerEl,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }

  // Add scroller if Lenis is active
  if (isLenisActive()) {
    scrollTriggerOptions.scroller = document.documentElement
  }

  return gsap.to(mediaEl, {
    y: '-10%', // Subtle parallax movement
    ease: 'none',
    scrollTrigger: scrollTriggerOptions,
  })
}

/**
 * Staggered card reveal animation
 * @param {HTMLElement} containerEl - Container with .card elements
 * @returns {gsap.core.ScrollTrigger} ScrollTrigger instance
 */
export function cardStaggerReveal(containerEl) {
  if (!containerEl) return null

  const cards = containerEl.querySelectorAll('.card, article')
  if (cards.length === 0) return null

  const scrollTriggerOptions = {
    trigger: containerEl,
    start: 'top 85%',
    toggleActions: 'play none none none',
  }

  // Add scroller if Lenis is active
  if (isLenisActive()) {
    scrollTriggerOptions.scroller = document.documentElement
  }

  return gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: scrollTriggerOptions,
    }
  )
}

// Example usage in components:
// import { heroIntro, heroParallax, cardStaggerReveal } from '@/lib/animations'
// const tl = heroIntro(heroRef.current)
// heroParallax(mediaRef.current, heroRef.current)

