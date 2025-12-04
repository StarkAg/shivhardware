import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Helper to check if Lenis should be disabled (mobile)
function shouldDisableLenis() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 700
}

// Debug flag for ScrollTrigger markers
const DEBUG_SCROLL_TRIGGERS = false

let lenis = null

/**
 * Initialize Lenis smooth scroll and integrate with GSAP ScrollTrigger
 * 
 * Easing options (Lenis easing):
 * - Linear: [1, 1, 0, 0]
 * - Ease: [0.25, 0.1, 0.25, 1]
 * - Ease-in: [0.42, 0, 1, 1]
 * - Ease-out: [0, 0, 0.58, 1]
 * - Ease-in-out: [0.42, 0, 0.58, 1]
 * - Custom: [x1, y1, x2, y2] (cubic bezier values)
 * 
 * Duration options:
 * - Lower values (1.0-1.5) = faster, snappier scroll
 * - Higher values (1.5-2.5) = slower, smoother scroll
 * - Default: 1.2 is a good balance
 */
export function initScroll({ disableOnMobile = true } = {}) {
  if (typeof window === 'undefined') return null

  // Disable Lenis on mobile devices if option is enabled
  if (disableOnMobile && shouldDisableLenis()) {
    console.log('Lenis disabled on mobile device (< 700px)')
    // Still register ScrollTrigger but without Lenis proxy
    gsap.registerPlugin(ScrollTrigger)
    if (DEBUG_SCROLL_TRIGGERS) {
      ScrollTrigger.config({ markers: true })
    }
    return null
  }

  // Register ScrollTrigger plugin (safe to call multiple times)
  gsap.registerPlugin(ScrollTrigger)
  
  // Enable debug markers if needed
  if (DEBUG_SCROLL_TRIGGERS) {
    ScrollTrigger.config({ markers: true })
  }

  // Initialize Lenis with customizable options
  lenis = new Lenis({
    duration: 1.2, // Scroll duration - adjust for speed (lower = faster, higher = slower)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease-out function
    // Alternative easing options (uncomment to use):
    // easing: [0.25, 0.1, 0.25, 1], // Ease (cubic bezier)
    // easing: [0.42, 0, 0.58, 1], // Ease-in-out
    orientation: 'vertical', // 'vertical' | 'horizontal'
    gestureOrientation: 'vertical', // 'vertical' | 'horizontal' | 'both'
    smoothWheel: true, // Enable smooth scrolling on wheel
    wheelMultiplier: 1, // Adjust wheel scroll sensitivity (0.5-2.0)
    touchMultiplier: 2, // Adjust touch scroll sensitivity
    infinite: false, // Infinite scroll
  })

  // Get scroll value from Lenis
  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    // Update GSAP ScrollTrigger with Lenis scroll position
    ScrollTrigger.update()
  })

  // Connect Lenis to GSAP ScrollTrigger
  // Use document.documentElement for better compatibility
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (value !== undefined) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  })
  
  // Performance tip: Use passive event listeners where possible
  // Lenis handles scroll events efficiently via requestAnimationFrame

  // Update ScrollTrigger on Lenis scroll
  ScrollTrigger.addEventListener('refresh', () => {
    lenis.resize()
  })

  // Start the Lenis animation loop
  // Performance: requestAnimationFrame is more efficient than scroll events
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // Refresh ScrollTrigger after Lenis is initialized
  ScrollTrigger.refresh()
  
  // Store lenis instance globally for animations.js to check
  if (typeof window !== 'undefined') {
    window.__lenis = lenis
  }
  
  // Return lenis instance for external use if needed
  return lenis
}

/**
 * Destroy Lenis instance and clean up ScrollTrigger
 */
export function destroyScroll() {
  if (typeof window === 'undefined') return

  if (lenis) {
    lenis.destroy()
    lenis = null
  }

  // Remove global reference
  if (typeof window !== 'undefined') {
    window.__lenis = undefined
  }

  // Clean up ScrollTrigger
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill()
  })
}

