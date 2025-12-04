'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * CursorFollower Component
 * 
 * A smooth, lagging cursor follower with hover scale effects
 * Automatically hides on touch devices for better UX
 */
export default function CursorFollower() {
  const cursorRef = useRef(null)
  const rafRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Current position (where cursor is)
  const currentPos = useRef({ x: 0, y: 0 })
  // Follower position (where the circle is)
  const followerPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Detect touch devices
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    }

    setIsTouchDevice(checkTouchDevice())

    // Don't initialize on touch devices
    if (checkTouchDevice()) return

    const cursor = cursorRef.current
    if (!cursor) return

    // Update current position on mouse move
    const handleMouseMove = (e) => {
      currentPos.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Handle hover scale on elements with .hover-scale class
    const checkHoverScale = (element) => {
      // Check if element is valid
      if (!element) return false
      
      // Check if element itself has the class
      if (element.classList && typeof element.classList.contains === 'function') {
        if (element.classList.contains('hover-scale')) return true
      }
      
      // Try using closest if available
      if (typeof element.closest === 'function') {
        try {
          const closest = element.closest('.hover-scale')
          if (closest) return true
        } catch (e) {
          // closest might fail in some cases, fall through to manual check
        }
      }
      
      // Fallback: manually check parent elements
      let current = element.parentElement || element.parentNode
      let depth = 0
      const maxDepth = 10 // Prevent infinite loops
      
      while (current && depth < maxDepth) {
        if (current.classList && typeof current.classList.contains === 'function') {
          if (current.classList.contains('hover-scale')) {
            return true
          }
        }
        current = current.parentElement || current.parentNode
        depth++
      }
      
      return false
    }

    const handleMouseOver = (e) => {
      if (checkHoverScale(e.target)) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e) => {
      // Only set to false if we're leaving the hover-scale element entirely
      if (!checkHoverScale(e.relatedTarget)) {
        setIsHovering(false)
      }
    }

    // Smooth lag animation using requestAnimationFrame
    const animate = () => {
      // Calculate lag (easing factor - lower = more lag, higher = less lag)
      const lagFactor = 0.15

      // Interpolate follower position towards current position
      followerPos.current.x +=
        (currentPos.current.x - followerPos.current.x) * lagFactor
      followerPos.current.y +=
        (currentPos.current.y - followerPos.current.y) * lagFactor

      // Update cursor position (centered on cursor)
      if (cursor) {
        cursor.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    // Start animation loop
    animate()

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver, true)
    document.addEventListener('mouseout', handleMouseOut, true)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver, true)
      document.removeEventListener('mouseout', handleMouseOut, true)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Don't render on touch devices
  if (isTouchDevice) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="cursor-follower"
      aria-hidden="true"
    >
      <div
        className="cursor-follower-inner"
        style={{
          transform: isHovering ? 'scale(2)' : 'scale(1)',
        }}
      />
    </div>
  )
}

