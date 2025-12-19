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

  // Texture controls
  const [selectedTexture, setSelectedTexture] = useState<string>('Texture2.jpg')
  const [textureOpacity, setTextureOpacity] = useState<number>(0.1)

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

  // Texture background style with opacity
  const textureBgStyle = {
    backgroundImage: `url(/${selectedTexture})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: textureOpacity,
  }

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] pt-24 pb-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Texture Background */}
        <div
          className="absolute inset-0"
          style={textureBgStyle}
        />
        
        {/* Texture Controls Panel - Hidden */}
        <div className="absolute top-24 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 space-y-3 min-w-[200px] hidden">
          <div className="text-white text-sm font-semibold mb-2">Texture Controls</div>
          
          {/* Texture Selection */}
          <div>
            <label className="text-white text-xs mb-1 block">Texture:</label>
            <select
              value={selectedTexture}
              onChange={(e) => setSelectedTexture(e.target.value)}
              className="w-full bg-black/50 border border-white/30 rounded px-2 py-1 text-white text-xs"
            >
              <option value="Texture1.png">Texture 1</option>
              <option value="Texture2.jpg">Texture 2</option>
              <option value="Texture3.png">Texture 3</option>
            </select>
          </div>
          
          {/* Texture Opacity Slider */}
          <div>
            <label className="text-white text-xs mb-1 block">
              Texture Opacity: {(textureOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={textureOpacity}
              onChange={(e) => setTextureOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Side - Door Diagram */}
            <div className="space-y-6 flex flex-col">
              <div className="border border-[var(--muted)]/20 p-8 backdrop-blur-sm rounded-lg relative" style={{ height: '700px', backgroundColor: 'var(--box-bg-door)' }}>
                {/* Area Display - Corner of Box */}
                <div className="absolute top-2 right-2 text-center p-1.5 backdrop-blur-md border border-white/20 rounded shadow-lg z-10" style={{ backgroundColor: 'var(--box-bg)' }}>
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
            <div className="space-y-6 flex flex-col items-center mt-2">
              <div className="flex items-center gap-10 justify-center w-full">
                {/* Dimensions Grid Section */}
                <div className="flex flex-col items-center">
                  {/* Grid with inputs */}
                  <div className="flex items-center gap-4 relative -mt-[1.175rem]">
                    {/* Height Label - Centered above Height column */}
                    <div className="absolute left-6 -top-[26px] w-32 flex items-center justify-center">
                      <span className="text-sm text-[var(--fg)]">Height</span>
                    </div>
                    
                    {/* Width Label - Centered above Width column */}
                    <div className="absolute left-[236px] -top-[26px] w-32 flex items-center justify-center">
                      <span className="text-sm text-[var(--fg)]">Width</span>
                    </div>
                    
                    {/* Inch Label - Centered with first row */}
                    <div className="absolute -left-[16px] top-1/4 -translate-y-1/2 flex items-center">
                      <span className="text-sm text-[var(--fg)]">Inch</span>
                    </div>
                    
                    {/* Soot Label - Centered with second row */}
                    <div className="absolute -left-[16px] top-3/4 -translate-y-1/2 flex items-center">
                      <span className="text-sm text-[var(--fg)]">Soot</span>
                    </div>
                    
                    {/* Grid with inputs */}
                    <div className="flex border border-[var(--fg)]/80 divide-x divide-[var(--fg)]/80 relative ml-6 rounded" style={{ backgroundColor: 'var(--box-bg)' }}>
                      
                      {/* Column 1: Height */}
                      <div className="flex flex-col w-32">
                        <div className="flex-1 border-b border-[var(--fg)]/50 flex items-center justify-center py-3">
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
                              if (numValue > MAX_HEIGHT) {
                                setHeightWarning(`Max ${MAX_HEIGHT}"`)
                                setHeight(MAX_HEIGHT)
                              } else {
                                setHeightWarning(null)
                                setHeight(numValue)
                              }
                            }}
                            className="text-center bg-transparent px-2 py-1 text-lg text-[var(--fg)] focus:outline-none mx-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="65"
                            style={{ MozAppearance: 'textfield' }}
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-center py-3">
                          <select
                            value={heightSoot}
                            onChange={(e) => setHeightSoot(Number(e.target.value))}
                            className="text-center bg-transparent px-2 py-1 text-lg text-[var(--fg)] focus:outline-none appearance-none cursor-pointer"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
                              <option key={val} value={val}>{val}/8</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Column 2: X */}
                      <div className="flex items-center justify-center w-20">
                        <span className="text-5xl text-[var(--fg)] leading-none">X</span>
                      </div>

                      {/* Column 3: Width */}
                      <div className="flex flex-col w-32">
                        <div className="flex-1 border-b border-[var(--fg)]/50 flex items-center justify-center py-3">
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
                              if (numValue > MAX_WIDTH) {
                                setWidthWarning(`Max ${MAX_WIDTH}"`)
                                setWidth(MAX_WIDTH)
                              } else {
                                setWidthWarning(null)
                                setWidth(numValue)
                              }
                            }}
                            className="text-center bg-transparent px-2 py-1 text-lg text-[var(--fg)] focus:outline-none mx-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="30"
                            style={{ MozAppearance: 'textfield' }}
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-center py-3">
                          <select
                            value={widthSoot}
                            onChange={(e) => setWidthSoot(Number(e.target.value))}
                            className="text-center bg-transparent px-2 py-1 text-lg text-[var(--fg)] focus:outline-none appearance-none cursor-pointer"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
                              <option key={val} value={val}>{val}/8</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thickness Grid Section */}
                <div className="flex flex-col">
                  {/* Thickness Label - Plain text above grid */}
                  <div className="mb-2 flex items-center justify-center">
                    <span className="text-sm text-[var(--fg)]">Thickness</span>
                  </div>
                  
                  {/* Grid with buttons */}
                  <div className="flex flex-col border border-[var(--fg)]/80 divide-y border-collapse w-44 rounded" style={{ backgroundColor: 'var(--box-bg)' }}>
                  <button
                    onClick={() => setSelectedThickness('1.2 MM')}
                    className={`h-14 px-3 transition-colors text-sm flex items-center justify-center ${
                      selectedThickness === '1.2 MM' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'hover:bg-[var(--fg)]/10'
                    }`}
                  >
                    1.2 MM
                  </button>
                  <button
                    onClick={() => setSelectedThickness('1.6 MM')}
                    className={`h-14 px-3 transition-colors text-sm flex items-center justify-center ${
                      selectedThickness === '1.6 MM' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'hover:bg-[var(--fg)]/10'
                    }`}
                  >
                    1.6 MM
                  </button>
                  <button
                    onClick={() => setSelectedThickness('1.2 MM Hindalco')}
                    className={`h-14 px-3 transition-colors text-sm flex flex-col items-center justify-center ${
                      selectedThickness === '1.2 MM Hindalco' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'hover:bg-[var(--fg)]/10'
                    }`}
                  >
                    <div>1.2 MM</div>
                    <div className="text-[10px] opacity-80">(Hindalco)</div>
                  </button>
                  </div>
                </div>
              </div>

              {/* Separator Line - Dynamic thickness simulation */}
              <div className="w-full max-w-lg mt-8 mb-4">
                <div 
                  className="bg-[var(--fg)]/80 transition-all duration-300 mx-auto"
                  style={{
                    width: '100%',
                    height: selectedThickness === '1.2 MM' ? '2px' : selectedThickness === '1.6 MM' ? '6px' : '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                ></div>
              </div>

              {/* Options Section */}
              <div className="flex flex-col -ml-4" style={{ width: '103%', maxWidth: 'none', marginTop: '4.8rem' }}>
                <div className="mb-2 flex items-center justify-center">
                  <span className="text-sm text-[var(--fg)]">Options</span>
                </div>
                <div className="border border-[var(--muted)]/20 p-6 rounded-lg flex flex-col w-full" style={{ backgroundColor: 'var(--box-bg)' }}>
                <div className="space-y-3 flex-1">
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
                </div>

                {/* Action Buttons: Total, New, Add To Cart */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <button
                    className="px-4 py-3 border-2 border-[var(--muted)]/30 text-[var(--fg)] hover:border-[var(--accent)] transition-colors rounded font-medium"
                    style={{ backgroundColor: 'var(--box-bg)' }}
                  >
                    <div className="text-xs text-[var(--muted)] mb-1">Total</div>
                    <div className="text-lg font-bold text-[var(--accent)]">
                      ₹{Math.round(calculations.total + calculations.addonsTotal)}
                    </div>
                  </button>
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
                    className="px-4 py-3 border-2 border-[var(--muted)]/30 text-[var(--fg)] hover:border-[var(--accent)] hover:bg-[var(--muted)]/10 transition-colors rounded font-medium"
                    style={{ backgroundColor: 'var(--box-bg)' }}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setShowPrintDetails(!showPrintDetails)}
                    className="px-4 py-3 border-2 border-[var(--accent)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors rounded font-medium"
                    style={{ backgroundColor: 'var(--box-bg)' }}
                  >
                    Add To Cart
                  </button>
                </div>

                {/* Additional Buttons: D1, D2, D3 */}
                <div className="mt-3 p-3 border border-[var(--muted)]/20 rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--box-bg-track)' }}>
                  <div className="flex gap-3 justify-start">
                    <button className="w-12 h-12 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50 hover:bg-[var(--muted)]/10 transition-colors rounded text-sm font-medium flex items-center justify-center flex-shrink-0">
                      D1
                    </button>
                    <button className="w-12 h-12 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50 hover:bg-[var(--muted)]/10 transition-colors rounded text-sm font-medium flex items-center justify-center flex-shrink-0">
                      D2
                    </button>
                    <button className="w-12 h-12 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--muted)]/50 hover:bg-[var(--muted)]/10 transition-colors rounded text-sm font-medium flex items-center justify-center flex-shrink-0">
                      D3
                    </button>
                  </div>
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
