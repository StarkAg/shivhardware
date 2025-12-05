'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  const applyTheme = (newTheme) => {
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    root.setAttribute('data-theme', newTheme)
    
    if (newTheme === 'light') {
      root.style.setProperty('--bg', '#ffffff')
      root.style.setProperty('--fg', '#0b0b0b')
      root.style.setProperty('--muted', '#666666')
      root.style.setProperty('--accent', '#0b0b0b')
    } else {
      root.style.setProperty('--bg', '#0b0b0b')
      root.style.setProperty('--fg', '#ffffff')
      root.style.setProperty('--muted', '#999999')
      root.style.setProperty('--accent', '#ffffff')
    }
  }

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark') // Default to dark
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // Always provide the context, even before mounted
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
