'use client'

import { useMemo, useState } from 'react'
import {
  calculateAluminiumDoor,
  aluminiumDoorRates,
  type AluminiumDoorThickness,
} from '@/lib/calculators'

export default function AluminiumDoorPage() {
  const MAX_HEIGHT = 84
  const MAX_WIDTH = 36

  const [height, setHeight] = useState<number | ''>(65)
  const [width, setWidth] = useState<number | ''>(30)
  const [heightSoot, setHeightSoot] = useState(0)
  const [widthSoot, setWidthSoot] = useState(0)
  const [chaukhat, setChaukhat] = useState(true)
  const [accessories, setAccessories] = useState(true)
  const [decorFilm, setDecorFilm] = useState(true)
  const [brownCoated, setBrownCoated] = useState(true)
  const [selectedThickness, setSelectedThickness] = useState<AluminiumDoorThickness>('1.2 MM')
  const [showPrintDetails, setShowPrintDetails] = useState(false)
  
  // Validation warnings
  const [heightWarning, setHeightWarning] = useState<string | null>(null)
  const [widthWarning, setWidthWarning] = useState<string | null>(null)

  const calculations = useMemo(() => {
    return calculateAluminiumDoor({
      height: height === '' ? undefined : height,
      width: width === '' ? undefined : width,
      heightSoot,
      widthSoot,
      selectedThickness,
      chaukhat,
      accessories,
      decorFilm,
      brownCoated,
    })
  }, [height, width, heightSoot, widthSoot, chaukhat, accessories, decorFilm, brownCoated, selectedThickness])

  const rates = aluminiumDoorRates

  // Convert area to m² for display (1 sqft = 0.092903 m²)
  const areaInM2 = (calculations.area * 0.092903).toFixed(2)

  // Maximize container space - minimize padding for maximum door size
  const PADDING = 30 // Reduced padding to maximize usable space
  const CONTAINER_HEIGHT_PX = 700 - (PADDING * 2) // 640px available (was 580px)
  const CONTAINER_WIDTH_PX = 640  // Estimate for grid column width
  
  // Calculate optimal scale factor to maximize door size
  // For maximum door (84" x 36"), find best fit using all available space
  const scaleByHeight = CONTAINER_HEIGHT_PX / MAX_HEIGHT // 640/84 = 7.62 px/inch
  const scaleByWidth = CONTAINER_WIDTH_PX / MAX_WIDTH    // 640/36 = 17.78 px/inch
  
  // Use smaller scale to ensure max door fits perfectly in both dimensions
  // This maximizes door size while maintaining aspect ratio
  const optimalScaleFactor = Math.min(scaleByHeight, scaleByWidth) // 7.62 (height is limiting)
  
  // Calculate aspect ratio for current door (width / height)
  const doorAspectRatio = calculations.widthInch / calculations.heightInch
  
  // Calculate scale factor based on maximum door size
  // Max door: 84" height x 36" width
  // Scale so max door fits perfectly in container
  const maxDoorAspectRatio = MAX_WIDTH / MAX_HEIGHT // 36/84 = 0.4286
  
  // Calculate scale factor: how many pixels per inch for max door to fit
  const scaleByMaxHeight = CONTAINER_HEIGHT_PX / MAX_HEIGHT // 640/84 = 7.62 px/inch
  const scaleByMaxWidth = CONTAINER_WIDTH_PX / MAX_WIDTH    // 640/36 = 17.78 px/inch
  
  // Use the smaller scale to ensure max door fits in container
  const scaleFactor = Math.min(scaleByMaxHeight, scaleByMaxWidth) // 7.62
  
  // Calculate scaled dimensions for current door using the scale factor
  // This maintains proper proportions relative to max door size
  const scaledWidth = calculations.widthInch * scaleFactor
  const scaledHeight = calculations.heightInch * scaleFactor

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Side - Door Diagram */}
            <div className="space-y-6 flex flex-col">
              <div className="border border-[var(--muted)]/20 p-8 bg-black/20 backdrop-blur-sm rounded-lg relative" style={{ height: '700px' }}>
                {/* Area Display - Corner of Box */}
                <div className="absolute top-2 right-2 text-center p-1.5 bg-[var(--bg)]/90 border border-[var(--muted)]/30 rounded shadow-lg backdrop-blur-sm z-10">
                  <p className="text-[9px] text-[var(--muted)] mb-0.5 leading-tight">Area</p>
                  <p className="text-[10px] font-semibold text-[var(--fg)] leading-tight">{areaInM2} m²</p>
                  <p className="text-[9px] text-[var(--muted)]/70 leading-tight">({calculations.area} Sqft)</p>
                </div>
                
                {/* Door Visual - Properly scaled with correct ratios */}
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
                    {/* Frame (Door Frame) - Outer Structure */}
                    {chaukhat && (
                      <div 
                        className="absolute inset-0 border-4 border-[var(--accent)]/40 bg-[var(--muted)]/5 rounded-sm"
                        style={{
                          padding: '8px',
                        }}
                      >
                        {/* Frame Inner Shadow */}
                        <div className="absolute inset-0 border border-[var(--accent)]/20 rounded-sm"></div>
                      </div>
                    )}
                    
                    {/* Door Panel */}
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
                      {/* Door Panel Texture/Pattern */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                      }}></div>
                      
                      {/* Door Hinges - Left Side (typically 3 hinges) */}
                      <div className="absolute left-2 top-[10%] w-1 h-6 bg-[var(--muted)]/50 rounded-sm"></div>
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--muted)]/50 rounded-sm"></div>
                      <div className="absolute left-2 bottom-[10%] w-1 h-6 bg-[var(--muted)]/50 rounded-sm"></div>

                      {/* Door Lock/Strike Plate Indicator - Right Side */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-8 bg-[var(--muted)]/40 rounded-sm"></div>
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
                            // Don't set height if total exceeds, just warn
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
                        placeholder="65"
                      />
                      {heightWarning && (
                        <p className="mt-1 text-xs text-red-500">{heightWarning}</p>
                      )}
                    </div>
                    <select
                      value={heightSoot}
                      onChange={(e) => {
                        const newSoot = Number(e.target.value)
                        const currentHeight = height === '' ? 65 : height
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
                            // Don't set width if total exceeds, just warn
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
                        placeholder="30"
                      />
                      {widthWarning && (
                        <p className="mt-1 text-xs text-red-500">{widthWarning}</p>
                      )}
                    </div>
                    <select
                      value={widthSoot}
                      onChange={(e) => {
                        const newSoot = Number(e.target.value)
                        const currentWidth = width === '' ? 30 : width
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
                <label className="block text-sm font-medium mb-3 text-[var(--fg)] flex items-center gap-2">
                  <span>Aluminium Thickness:</span>
                  {/* Dynamic Thickness Visualizer - Inline */}
                  <span className="inline-flex items-center gap-2 text-[var(--muted)] text-xs">
                    <div 
                      className="bg-[var(--accent)] rounded-full transition-all duration-300"
                      style={{
                        width: selectedThickness === '1.2 MM' ? '40px' : selectedThickness === '1.6 MM' ? '60px' : '50px',
                        height: selectedThickness === '1.2 MM' ? '2px' : selectedThickness === '1.6 MM' ? '3px' : '2.5px',
                      }}
                    ></div>
                    {selectedThickness === '1.6 MM' && (
                      <span className="text-[var(--accent)] text-[10px] font-semibold">★ Best</span>
                    )}
                  </span>
                </label>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedThickness('1.2 MM')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors relative ${
                      selectedThickness === '1.2 MM'
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    1.2 MM
                  </button>
                  <button
                    onClick={() => setSelectedThickness('1.6 MM')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors relative ${
                      selectedThickness === '1.6 MM'
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    1.6 MM
                    {selectedThickness === '1.6 MM' ? (
                      <span className="absolute -top-1 -right-1 bg-[var(--bg)] text-[var(--accent)] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--accent)]">★</span>
                    ) : (
                      <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold px-1.5 py-0.5 rounded-full">★</span>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedThickness('1.2 MM Hindalco')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                      selectedThickness === '1.2 MM Hindalco'
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    1.2 MM Hindalco
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
                      <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Door Frame</span>
                    </div>
                    {chaukhat && (
                      <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations.chaukhatCost)}</span>
                    )}
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={accessories}
                        onChange={(e) => setAccessories(e.target.checked)}
                        className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                      />
                      <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Accessories</span>
                    </div>
                    {accessories && (
                      <span className="text-[var(--fg)] font-medium">₹{calculations.accessoriesCost}</span>
                    )}
                  </label>
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
                    {decorFilm && (
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
                    {brownCoated && (
                      <span className="text-[var(--fg)] font-medium">₹{Math.round(calculations.brownCoatedCost)}</span>
                    )}
                  </label>
                </div>

                {/* Total Box - Below Options */}
                <div className="mt-6">
                  <div className="border-2 border-[var(--accent)]/50 p-4 bg-black/30 backdrop-blur-sm rounded-lg text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[var(--accent)]">
                      ₹{Math.round(calculations.total + calculations.addonsTotal)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Below Options */}
                <div className="mt-4 flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setHeight(65)
                          setWidth(30)
                          setHeightSoot(0)
                          setWidthSoot(0)
                          setChaukhat(true)
                          setAccessories(true)
                          setDecorFilm(true)
                          setBrownCoated(true)
                          setSelectedThickness('1.2 MM')
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
          {showPrintDetails && (
            <>
          {/* Detailed Breakdown */}
          <div className="border border-[var(--muted)]/20 overflow-x-auto mb-8 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--muted)]/20 bg-black/20">
                  <th className="border-r border-[var(--muted)]/20 p-4 text-left text-[var(--fg)] font-semibold">Item</th>
                  <th className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)] font-semibold">1.2 MM</th>
                  <th className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)] font-semibold">1.6 MM</th>
                  <th className="p-4 text-center text-[var(--fg)] font-semibold">1.2 MM Hindalco</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Door</td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.2 MM' ? `₹${Math.round(calculations.doorCost)}` : `@${rates['1.2 MM'].door}`}
                  </td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.6 MM' ? `₹${Math.round(calculations.doorCost)}` : `@${rates['1.6 MM'].door}`}
                  </td>
                  <td className="p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.2 MM Hindalco' ? `₹${Math.round(calculations.doorCost)}` : `@${rates['1.2 MM Hindalco'].door}`}
                  </td>
                </tr>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Door Frame</td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.2 MM' && chaukhat ? `₹${Math.round(calculations.chaukhatCost)}` : `@${rates['1.2 MM'].chaukhat}`}
                  </td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.6 MM' && chaukhat ? `₹${Math.round(calculations.chaukhatCost)}` : `@${rates['1.6 MM'].chaukhat}`}
                  </td>
                  <td className="p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.2 MM Hindalco' && chaukhat ? `₹${Math.round(calculations.chaukhatCost)}` : `@${rates['1.2 MM Hindalco'].chaukhat}`}
                  </td>
                </tr>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Accessories</td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {accessories ? rates['1.2 MM'].accessories : ''}
                  </td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {accessories ? rates['1.6 MM'].accessories : ''}
                  </td>
                  <td className="p-4 text-center text-[var(--fg)]">
                    {accessories ? rates['1.2 MM Hindalco'].accessories : ''}
                  </td>
                </tr>
                <tr className="border-t-2 border-[var(--muted)]/30 font-bold bg-black/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Total</td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.2 MM' ? `₹${Math.round(calculations.total)}` : ''}
                  </td>
                  <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.6 MM' ? `₹${Math.round(calculations.total)}` : ''}
                  </td>
                  <td className="p-4 text-center text-[var(--fg)]">
                    {selectedThickness === '1.2 MM Hindalco' ? `₹${Math.round(calculations.total)}` : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add-ons Section */}
          {(decorFilm || brownCoated) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-[var(--fg)]">Add-ons</h2>
              <div className="border border-[var(--muted)]/20 overflow-x-auto rounded-lg">
                <table className="w-full">
                  <tbody>
                    {decorFilm && (
                      <tr className="border-b border-[var(--muted)]/10">
                        <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Décor Film</td>
                        <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">@30</td>
                        <td className="p-4 text-center text-[var(--fg)] font-semibold">
                          ₹{Math.round(calculations.decorFilmCost)}
                        </td>
                      </tr>
                    )}
                    {brownCoated && (
                      <tr>
                        <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Brown Coated Aluminium</td>
                        <td className="border-r border-[var(--muted)]/20 p-4 text-center text-[var(--fg)]">@60</td>
                        <td className="p-4 text-center text-[var(--fg)] font-semibold">
                          ₹{Math.round(calculations.brownCoatedCost)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                        <span className="font-bold">Door Frame:</span> {calculations.chaukhatRft} Rft
              </p>
              <p className="text-[var(--fg)]">
                <span className="font-bold">Thickness:</span> {selectedThickness}
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
