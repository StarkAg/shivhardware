'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  calculateWindow2Track,
  calculateWindow3Track,
  type WindowThickness,
  type Window3TrackThickness,
  type GlassType,
} from '@/lib/calculators'

type WindowType = '2track' | '3track'

function WindowCalculatorContent() {
  const searchParams = useSearchParams()
  const defaultType = searchParams?.get('type') === '3track' ? '3track' : '2track'
  
  // Toggle between 2-track and 3-track
  const [windowType, setWindowType] = useState<WindowType>(defaultType)
  
  useEffect(() => {
    if (searchParams?.get('type') === '3track') {
      setWindowType('3track')
    }
  }, [searchParams])

  // Window visualization constants (windows are typically wider)
  const MAX_HEIGHT = 84
  const MAX_WIDTH = 72

  // Shared state
  const [height, setHeight] = useState<number | ''>(60)
  const [width, setWidth] = useState<number | ''>(48)
  const [heightSoot, setHeightSoot] = useState(0)
  const [widthSoot, setWidthSoot] = useState(0)
  const [glassType, setGlassType] = useState<GlassType>('clear')
  const [chaukhat, setChaukhat] = useState(true)
  const [decorFilm, setDecorFilm] = useState(false)
  const [brownCoated, setBrownCoated] = useState(false)

  // 2-track specific state
  const [thickness2Track, setThickness2Track] = useState<WindowThickness>('1.2 MM')
  const [fullSSNet, setFullSSNet] = useState(false)

  // 3-track specific state
  const [thickness3Track, setThickness3Track] = useState<Window3TrackThickness>('1.2 mm')
  const [ssNet, setSsNet] = useState(false)

  const [showPrintDetails, setShowPrintDetails] = useState(false)

  // Validation warnings
  const [heightWarning, setHeightWarning] = useState<string | null>(null)
  const [widthWarning, setWidthWarning] = useState<string | null>(null)

  // Calculate based on window type
  const calculations2Track = useMemo(() => {
    if (windowType !== '2track') return null
    return calculateWindow2Track({
      height: height === '' ? 60 : Number(height),
      width: width === '' ? 48 : Number(width),
      heightSoot,
      widthSoot,
      selectedThickness: thickness2Track,
      glassType,
      chaukhat,
      decorFilm,
      fullSSNet,
      brownCoated,
    })
  }, [windowType, height, width, heightSoot, widthSoot, thickness2Track, glassType, chaukhat, decorFilm, fullSSNet, brownCoated])

  const calculations3Track = useMemo(() => {
    if (windowType !== '3track') return null
    return calculateWindow3Track({
      height: height === '' ? 60 : Number(height),
      width: width === '' ? 48 : Number(width),
      heightSoot,
      widthSoot,
      selectedThickness: thickness3Track,
      glassType,
      chaukhat,
      decorFilm,
      ssNet,
      brownCoated,
    })
  }, [windowType, height, width, heightSoot, widthSoot, thickness3Track, glassType, chaukhat, decorFilm, ssNet, brownCoated])

  const calculations = windowType === '2track' ? calculations2Track : calculations3Track

  // Convert area to m² for display (1 sqft = 0.092903 m²)
  const areaInM2 = calculations ? (calculations.area * 0.092903).toFixed(2) : '0.00'

  // Maximize container space
  const PADDING = 30
  const CONTAINER_HEIGHT_PX = 700 - (PADDING * 2) // 640px available
  const CONTAINER_WIDTH_PX = 640

  // Calculate scale factor
  const scaleByHeight = CONTAINER_HEIGHT_PX / MAX_HEIGHT
  const scaleByWidth = CONTAINER_WIDTH_PX / MAX_WIDTH
  const optimalScaleFactor = Math.min(scaleByHeight, scaleByWidth)

  // Calculate scaled dimensions
  const scaledWidth = calculations ? calculations.widthInch * optimalScaleFactor : 480
  const scaledHeight = calculations ? calculations.heightInch * optimalScaleFactor : 360

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] pt-24 pb-16 sm:py-20 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/Gemini_Generated_Image_foqkoofoqkoofoqk-2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Toggle Button for Window Type */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex border-2 border-[var(--muted)]/30 rounded-lg p-1 bg-black/20 backdrop-blur-sm">
              <button
                onClick={() => setWindowType('2track')}
                className={`px-6 py-3 rounded-md transition-all duration-300 ${
                  windowType === '2track'
                    ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                    : 'text-[var(--fg)] hover:text-[var(--accent)]'
                }`}
              >
                2 Track Window
              </button>
              <button
                onClick={() => setWindowType('3track')}
                className={`px-6 py-3 rounded-md transition-all duration-300 ${
                  windowType === '3track'
                    ? 'bg-[var(--accent)] text-[var(--bg)] font-semibold'
                    : 'text-[var(--fg)] hover:text-[var(--accent)]'
                }`}
              >
                3 Track Window
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Side - Window Diagram */}
            <div className="space-y-6 flex flex-col">
              <div className="border border-[var(--muted)]/20 p-8 bg-black/20 backdrop-blur-sm rounded-lg relative" style={{ height: '700px' }}>
                {/* Area Display - Corner of Box */}
                <div className="absolute top-2 right-2 text-center p-1.5 bg-[var(--bg)]/90 border border-[var(--muted)]/30 rounded shadow-lg backdrop-blur-sm z-10">
                  <p className="text-[9px] text-[var(--muted)] mb-0.5 leading-tight">Area</p>
                  <p className="text-[10px] font-semibold text-[var(--fg)] leading-tight">{areaInM2} m²</p>
                  <p className="text-[9px] text-[var(--muted)]/70 leading-tight">({calculations?.area || 0} Sqft)</p>
                </div>
                
                {/* Window Visual - Properly scaled */}
                {calculations && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ padding: `${PADDING}px` }}>
                    <div 
                      className="relative"
                      style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                    >
                      {/* Frame (Window Frame) */}
                      {chaukhat && (
                        <div 
                          className="absolute inset-0 border-4 border-[var(--accent)]/40 bg-[var(--muted)]/5 rounded-sm"
                          style={{
                            padding: '8px',
                          }}
                        >
                          <div className="absolute inset-0 border border-[var(--accent)]/20 rounded-sm"></div>
                        </div>
                      )}
                      
                      {/* Window Panel - Sliding Windows */}
                      <div 
                        className="relative mx-auto bg-gradient-to-br from-[var(--muted)]/20 to-[var(--muted)]/10 border-2 border-[var(--muted)]/30"
                        style={{
                          width: chaukhat ? 'calc(100% - 16px)' : '100%',
                          height: chaukhat ? 'calc(100% - 16px)' : '100%',
                          marginTop: chaukhat ? '8px' : '0',
                          marginLeft: chaukhat ? '8px' : '0',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {/* Window Glass Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)',
                        }}></div>
                        
                        {/* Sliding Track Indicators */}
                        {windowType === '2track' && (
                          <>
                            {/* Top Track */}
                            <div className="absolute top-2 left-0 right-0 h-1 bg-[var(--muted)]/60 rounded-full"></div>
                            {/* Bottom Track */}
                            <div className="absolute bottom-2 left-0 right-0 h-1 bg-[var(--muted)]/60 rounded-full"></div>
                          </>
                        )}
                        
                        {windowType === '3track' && (
                          <>
                            {/* Top Track */}
                            <div className="absolute top-2 left-0 right-0 h-1 bg-[var(--muted)]/60 rounded-full"></div>
                            {/* Middle Track */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-[var(--muted)]/60 rounded-full"></div>
                            {/* Bottom Track */}
                            <div className="absolute bottom-2 left-0 right-0 h-1 bg-[var(--muted)]/60 rounded-full"></div>
                          </>
                        )}

                        {/* Vertical Divider for sliding panels */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[var(--muted)]/40"></div>
                      </div>

                      {/* Height Dimension - Left Side */}
                      <div className="absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="flex-1 border-l-2 border-[var(--accent)]"></div>
                        <div className="px-2 py-1 bg-[var(--bg)] border border-[var(--muted)]/30 rounded text-xs font-medium text-[var(--fg)] whitespace-nowrap shadow-lg">
                          {calculations.heightDisplay}
                        </div>
                        <div className="flex-1 border-l-2 border-[var(--accent)]"></div>
                      </div>

                      {/* Width Dimension - Bottom */}
                      <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center pointer-events-none">
                        <div className="flex-1 border-t-2 border-[var(--accent)]"></div>
                        <div className="px-2 py-1 bg-[var(--bg)] border border-[var(--muted)]/30 rounded text-xs font-medium text-[var(--fg)] whitespace-nowrap mx-2 shadow-lg">
                          {calculations.widthDisplay}
                        </div>
                        <div className="flex-1 border-t-2 border-[var(--accent)]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Inputs and Options */}
            <div className="space-y-8">
              {/* Dimension Inputs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--fg)]">Height</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '') {
                            setHeight('')
                            setHeightWarning(null)
                            return
                          }
                          
                          const numValue = Number(value)
                          const totalHeight = numValue + (heightSoot / 8)
                          
                          if (numValue > MAX_HEIGHT) {
                            setHeightWarning(`Maximum height is ${MAX_HEIGHT}". Value will be clamped to ${MAX_HEIGHT}".`)
                            setHeight(MAX_HEIGHT)
                          } else if (totalHeight > MAX_HEIGHT) {
                            setHeightWarning(`Total height (${numValue}" + ${heightSoot}/8) exceeds maximum of ${MAX_HEIGHT}". Please reduce height or soot.`)
                            setHeight(numValue)
                          } else {
                            setHeightWarning(null)
                            setHeight(numValue)
                          }
                        }}
                        max={MAX_HEIGHT}
                        min={1}
                        className={`w-full border bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:outline-none transition-colors rounded ${
                          heightWarning 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-[var(--muted)]/30 focus:border-[var(--accent)]'
                        }`}
                        placeholder="60"
                      />
                      {heightWarning && (
                        <p className="mt-1 text-xs text-red-500">{heightWarning}</p>
                      )}
                    </div>
                    <select
                      value={heightSoot}
                      onChange={(e) => {
                        const newSoot = Number(e.target.value)
                        const currentHeight = height === '' ? 60 : Number(height)
                        const totalHeight = currentHeight + (newSoot / 8)
                        
                        if (totalHeight > MAX_HEIGHT) {
                          setHeightWarning(`Total height (${currentHeight}" + ${newSoot}/8 = ${totalHeight.toFixed(2)}") exceeds maximum of ${MAX_HEIGHT}". Please reduce height or soot.`)
                        } else {
                          setHeightWarning(null)
                        }
                        setHeightSoot(newSoot)
                      }}
                      className="w-24 border border-[var(--muted)]/30 bg-[var(--bg)] px-3 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors rounded"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
                        <option key={val} value={val}>
                          {val}/8
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--fg)]">Width</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '') {
                            setWidth('')
                            setWidthWarning(null)
                            return
                          }
                          
                          const numValue = Number(value)
                          const totalWidth = numValue + (widthSoot / 8)
                          
                          if (numValue > MAX_WIDTH) {
                            setWidthWarning(`Maximum width is ${MAX_WIDTH}". Value will be clamped to ${MAX_WIDTH}".`)
                            setWidth(MAX_WIDTH)
                          } else if (totalWidth > MAX_WIDTH) {
                            setWidthWarning(`Total width (${numValue}" + ${widthSoot}/8) exceeds maximum of ${MAX_WIDTH}". Please reduce width or soot.`)
                            setWidth(numValue)
                          } else {
                            setWidthWarning(null)
                            setWidth(numValue)
                          }
                        }}
                        max={MAX_WIDTH}
                        min={1}
                        className={`w-full border bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:outline-none transition-colors rounded ${
                          widthWarning 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-[var(--muted)]/30 focus:border-[var(--accent)]'
                        }`}
                        placeholder="48"
                      />
                      {widthWarning && (
                        <p className="mt-1 text-xs text-red-500">{widthWarning}</p>
                      )}
                    </div>
                    <select
                      value={widthSoot}
                      onChange={(e) => {
                        const newSoot = Number(e.target.value)
                        const currentWidth = width === '' ? 48 : Number(width)
                        const totalWidth = currentWidth + (newSoot / 8)
                        
                        if (totalWidth > MAX_WIDTH) {
                          setWidthWarning(`Total width (${currentWidth}" + ${newSoot}/8 = ${totalWidth.toFixed(2)}") exceeds maximum of ${MAX_WIDTH}". Please reduce width or soot.`)
                        } else {
                          setWidthWarning(null)
                        }
                        setWidthSoot(newSoot)
                      }}
                      className="w-24 border border-[var(--muted)]/30 bg-[var(--bg)] px-3 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors rounded"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
                        <option key={val} value={val}>
                          {val}/8
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Thickness Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-[var(--fg)]">
                  Aluminium Thickness:
                </label>
                
                {windowType === '2track' ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setThickness2Track('1.2 MM')}
                      className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                        thickness2Track === '1.2 MM'
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                      }`}
                    >
                      1.2 MM
                    </button>
                    <button
                      onClick={() => setThickness2Track('1.6 MM')}
                      className={`flex-1 px-4 py-3 border-2 rounded transition-colors relative ${
                        thickness2Track === '1.6 MM'
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                      }`}
                    >
                      1.6 MM
                      {thickness2Track === '1.6 MM' && (
                        <span className="absolute -top-1 -right-1 bg-[var(--bg)] text-[var(--accent)] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--accent)]">★</span>
                      )}
                    </button>
                    <button
                      onClick={() => setThickness2Track('1.2 MM Hindalco')}
                      className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                        thickness2Track === '1.2 MM Hindalco'
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                      }`}
                    >
                      1.2 MM Hindalco
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setThickness3Track('1.2 mm')}
                      className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                        thickness3Track === '1.2 mm'
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                      }`}
                    >
                      1.2 mm
                    </button>
                    <button
                      onClick={() => setThickness3Track('1.6 mm')}
                      className={`flex-1 px-4 py-3 border-2 rounded transition-colors relative ${
                        thickness3Track === '1.6 mm'
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                      }`}
                    >
                      1.6 mm
                      {thickness3Track === '1.6 mm' && (
                        <span className="absolute -top-1 -right-1 bg-[var(--bg)] text-[var(--accent)] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--accent)]">★</span>
                      )}
                    </button>
                    <button
                      onClick={() => setThickness3Track('1.2 mm Hindalco')}
                      className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                        thickness3Track === '1.2 mm Hindalco'
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                      }`}
                    >
                      1.2 mm Hindalco
                    </button>
                  </div>
                )}
              </div>

              {/* Glass Type */}
              <div>
                <label className="block text-sm font-medium mb-3 text-[var(--fg)]">Glass Type:</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setGlassType('clear')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                      glassType === 'clear'
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setGlassType('reflective')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                      glassType === 'reflective'
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    Reflective
                  </button>
                </div>
              </div>

              {/* Options Section */}
              <div>
                <label className="block text-sm font-medium mb-3 text-[var(--fg)]">Options →</label>
                <div className="space-y-3 border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={chaukhat}
                        onChange={(e) => setChaukhat(e.target.checked)}
                        className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                      />
                      <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Window Frame</span>
                    </div>
                    {chaukhat && calculations && (
                      <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations.chaukhatCost)}</span>
                    )}
                  </label>
                  
                  {windowType === '2track' ? (
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={fullSSNet}
                          onChange={(e) => setFullSSNet(e.target.checked)}
                          className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                        />
                        <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Full SS Net</span>
                      </div>
                      {fullSSNet && calculations2Track && (
                        <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations2Track.fullSSNetCost)}</span>
                      )}
                    </label>
                  ) : (
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={ssNet}
                          onChange={(e) => setSsNet(e.target.checked)}
                          className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                        />
                        <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">SS Net (Half)</span>
                      </div>
                      {ssNet && calculations3Track && (
                        <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations3Track.ssNetCost)}</span>
                      )}
                    </label>
                  )}
                  
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={decorFilm}
                        onChange={(e) => setDecorFilm(e.target.checked)}
                        className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                      />
                      <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Decor Film</span>
                    </div>
                    {decorFilm && calculations && (
                      <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations.decorFilmCost)}</span>
                    )}
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={brownCoated}
                        onChange={(e) => setBrownCoated(e.target.checked)}
                        className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                      />
                      <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Brown Coated Aluminium</span>
                    </div>
                    {brownCoated && calculations && (
                      <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations.brownCoatedCost)}</span>
                    )}
                  </label>
                </div>

                {/* Total Box - Below Options */}
                <div className="mt-6">
                  <div className="border-2 border-[var(--accent)]/50 p-4 bg-black/30 backdrop-blur-sm rounded-lg text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[var(--accent)]">
                      ₹{calculations ? Math.round(calculations.total + calculations.addonsTotal) : 0}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setHeight(60)
                      setWidth(48)
                      setHeightSoot(0)
                      setWidthSoot(0)
                      setChaukhat(true)
                      setDecorFilm(false)
                      setBrownCoated(false)
                      setFullSSNet(false)
                      setSsNet(false)
                      setGlassType('clear')
                      setThickness2Track('1.2 MM')
                      setThickness3Track('1.2 mm')
                      setShowPrintDetails(false)
                      setHeightWarning(null)
                      setWidthWarning(null)
                    }}
                    className="w-8 h-8 rounded bg-[var(--muted)]/10 hover:bg-[var(--muted)]/20 border border-[var(--muted)]/20 flex items-center justify-center transition-all duration-300 hover-scale text-[var(--fg)]"
                    aria-label="Reset calculator"
                    title="Reset"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <span className="text-[var(--muted)]/30">|</span>
                  <button
                    onClick={() => setShowPrintDetails(!showPrintDetails)}
                    className="w-8 h-8 rounded bg-[var(--muted)]/10 hover:bg-[var(--muted)]/20 border border-[var(--muted)]/20 flex items-center justify-center transition-all duration-300 hover-scale text-[var(--fg)]"
                    aria-label={showPrintDetails ? 'Hide details' : 'Print quote'}
                    title={showPrintDetails ? 'Hide Details' : 'Print Quote'}
                  >
                    {showPrintDetails ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown - Hidden by default */}
          {showPrintDetails && calculations && (
            <>
              {/* Print Section */}
              <div className="border border-[var(--muted)]/20 p-8 bg-black/20 backdrop-blur-sm rounded-lg">
                <div className="space-y-2 mb-6">
                  <p className="text-[var(--fg)]">
                    <span className="font-bold">Size:</span> {calculations.sizeDisplay}
                  </p>
                  <p className="text-[var(--fg)]">
                    <span className="font-bold">Area:</span> {calculations.area} Sqft ({areaInM2} m²)
                  </p>
                  <p className="text-[var(--fg)]">
                    <span className="font-bold">Glass Rate:</span> ₹{calculations.glassRate}/sqft
                  </p>
                  <p className="text-[var(--fg)]">
                    <span className="font-bold">Thickness:</span> {windowType === '2track' ? thickness2Track : thickness3Track}
                  </p>
                  <p className="text-[var(--fg)]">
                    <span className="font-bold">Glass Type:</span> {glassType === 'clear' ? 'Clear' : 'Reflective'}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--fg)]">
                    <span className="font-bold">Approved Name:</span> {calculations.approvedName}
                  </p>
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.print()}
                    className="bg-[var(--accent)] text-[var(--bg)] px-8 py-4 font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale rounded"
                  >
                    Print Quote
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default function WindowPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--fg)]">Loading calculator...</p>
      </main>
    }>
      <WindowCalculatorContent />
    </Suspense>
  )
}