'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import {
  calculateAluminiumDoor,
  aluminiumDoorRates,
  type AluminiumDoorThickness,
} from '@/lib/calculators'
import { useCart } from '@/contexts/CartContext'

export default function AluminiumDoorPage() {
  const MAX_HEIGHT = 84
  const MAX_WIDTH = 36
  const { addToCart } = useCart()

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
  const [addedToCart, setAddedToCart] = useState(false)
  const [heightSootOpen, setHeightSootOpen] = useState(false)
  const [widthSootOpen, setWidthSootOpen] = useState(false)
  const heightSootRef = useRef<HTMLDivElement>(null)
  const widthSootRef = useRef<HTMLDivElement>(null)
  const heightSootMenuRef = useRef<HTMLDivElement>(null)
  const widthSootMenuRef = useRef<HTMLDivElement>(null)
  
  // Validation warnings
  const [heightWarning, setHeightWarning] = useState<string | null>(null)
  const [widthWarning, setWidthWarning] = useState<string | null>(null)

  // Texture controls
  const [selectedTexture, setSelectedTexture] = useState<string>('Texture2.jpg')
  const [textureOpacity, setTextureOpacity] = useState<number>(0.1)

  // Close dropdowns when clicking outside and focus dropdown menu when opened
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (heightSootRef.current && !heightSootRef.current.contains(event.target as Node)) {
        setHeightSootOpen(false)
      }
      if (widthSootRef.current && !widthSootRef.current.contains(event.target as Node)) {
        setWidthSootOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    // Focus dropdown menu when it opens for keyboard navigation
    if (heightSootOpen && heightSootMenuRef.current) {
      heightSootMenuRef.current.focus()
    }
    if (widthSootOpen && widthSootMenuRef.current) {
      widthSootMenuRef.current.focus()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [heightSootOpen, widthSootOpen])

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

  // Responsive container: use aspect ratio instead of fixed px
  // Door aspect ratio drives the visual — width/height of current door
  const doorAspectRatio = calculations.widthInch / calculations.heightInch

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Left Side - Door Diagram */}
            <div className="flex flex-col gap-4">
              {/* Responsive diagram box: fixed portrait shape, door scales independently on each axis */}
              <div
                className="border border-[var(--muted)]/20 backdrop-blur-sm rounded-lg relative w-full mb-6"
                style={{
                  height: 'min(80vh, 700px)',
                  backgroundColor: 'var(--box-bg-door)',
                }}
              >
                {/* Area Display - Corner of Box */}
                <div className="absolute top-2 right-2 text-center p-1.5 backdrop-blur-md border border-white/20 rounded shadow-lg z-10" style={{ backgroundColor: 'var(--box-bg)' }}>
                  <p className="text-[9px] text-[var(--muted)] mb-0.5 leading-tight">Area</p>
                  <p className="text-[10px] font-semibold text-[var(--fg)] leading-tight">{areaInM2} m²</p>
                  <p className="text-[9px] text-[var(--muted)]/70 leading-tight">({calculations.area} Sqft)</p>
                </div>

                {/* Door Visual — image stretches to reflect actual door proportions */}
                {/* Container is fixed, inner div uses door's aspect ratio, images fill it with object-fit:fill */}
                {/* Left padding accommodates the height label so it doesn't get clipped */}
                <div className="absolute inset-6 pl-10 pb-8 flex items-center justify-center" style={{ containerType: 'size' }}>
                  <div
                    className="relative"
                    style={{
                      aspectRatio: `${calculations.widthInch} / ${calculations.heightInch}`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      // Fit within container on both axes — portrait doors constrained by height, wide doors by width
                      width: `min(100%, calc(100cqh * ${calculations.widthInch / calculations.heightInch}))`,
                    }}
                  >
                    {/* Layer 1: Base door body */}
                    <img
                      src={brownCoated ? '/Door Varients/door_base_brown (1).png' : '/Door Varients/door_base_plain.png'}
                      alt="Door base"
                      className="absolute inset-0 w-full h-full"
                      style={{ objectFit: 'fill' }}
                    />
                    {/* Layer 2: Frame (chaukhat) */}
                    {chaukhat && (
                      <img
                        src={brownCoated ? '/Door Varients/frame_brown.png' : '/Door Varients/frame_plain.png'}
                        alt="Door frame"
                        className="absolute inset-0 w-full h-full"
                        style={{ objectFit: 'fill' }}
                      />
                    )}
                    {/* Layer 3: Accessories */}
                    {accessories && (
                      <img
                        src="/Door Varients/accessories.png"
                        alt="Door accessories"
                        className="absolute inset-0 w-full h-full"
                        style={{ objectFit: 'fill' }}
                      />
                    )}

                    {/* Height Dimension - Left Side (inside container, won't clip) */}
                    <div className="absolute -left-9 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="flex-1 border-l-2 border-[var(--accent)]" />
                      <div className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--muted)]/30 rounded text-[10px] font-medium text-[var(--fg)] whitespace-nowrap shadow-lg">
                        {calculations.heightDisplay}
                      </div>
                      <div className="flex-1 border-l-2 border-[var(--accent)]" />
                    </div>

                    {/* Width Dimension - Bottom */}
                    <div className="absolute -bottom-7 left-0 right-0 flex items-center justify-center pointer-events-none">
                      <div className="flex-1 border-t-2 border-[var(--accent)]" />
                      <div className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--muted)]/30 rounded text-[10px] font-medium text-[var(--fg)] whitespace-nowrap mx-1 shadow-lg">
                        {calculations.widthDisplay}
                      </div>
                      <div className="flex-1 border-t-2 border-[var(--accent)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Inputs and Options */}
            <div className="space-y-6">
              {/* Dimensions + Thickness — stack on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 justify-center">
                {/* Dimensions Grid Section */}
                <div className="flex flex-col items-center w-full sm:w-auto">

                  {/* ── DESKTOP layout (sm+): original fixed-width grid ── */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="flex mb-1 pl-6">
                      <div className="w-32 text-center text-sm text-[var(--fg)]">Height</div>
                      <div className="w-20 opacity-0">X</div>
                      <div className="w-32 text-center text-sm text-[var(--fg)]">Width</div>
                    </div>
                    <div className="flex items-center gap-4 relative">
                      <div className="absolute -left-[16px] top-1/4 -translate-y-1/2"><span className="text-sm text-[var(--fg)]">Inch</span></div>
                      <div className="absolute -left-[16px] top-3/4 -translate-y-1/2"><span className="text-sm text-[var(--fg)]">Soot</span></div>
                      <div className="flex border border-[var(--fg)]/80 divide-x divide-[var(--fg)]/80 relative ml-6 rounded" style={{ backgroundColor: 'var(--box-bg)' }}>
                        {/* Height column */}
                        <div className="flex flex-col w-32">
                          <div className="flex-1 border-b border-[var(--fg)]/50 flex items-center justify-center py-3">
                            <input type="number" value={height} onChange={(e) => { const v = e.target.value; if (v === '') { setHeight(''); setHeightWarning(null); return; } const n = Number(v); if (n > MAX_HEIGHT) { setHeightWarning(`Max ${MAX_HEIGHT}"`); setHeight(MAX_HEIGHT); } else { setHeightWarning(null); setHeight(n); } }} className="text-center bg-transparent px-2 py-1 text-lg text-[var(--fg)] focus:outline-none mx-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="65" style={{ MozAppearance: 'textfield' }} />
                          </div>
                          <div ref={heightSootRef} className="flex-1 flex items-center justify-center py-3 relative cursor-pointer hover:bg-[var(--fg)]/5 transition-colors" onClick={() => setHeightSootOpen(!heightSootOpen)} tabIndex={0}>
                            <div className="text-lg text-[var(--fg)]">{heightSoot}/8</div>
                            <div className={`absolute right-2 transition-transform ${heightSootOpen ? 'rotate-180' : ''}`}><svg className="w-4 h-4 text-[var(--fg)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                            {heightSootOpen && (<div ref={heightSootMenuRef} className="absolute top-full left-0 right-0 mt-1 z-50 border border-[var(--fg)]/20 rounded shadow-lg overflow-hidden max-h-48 overflow-y-auto outline-none" style={{ backgroundColor: 'var(--bg)' }} tabIndex={0} onKeyDown={(e) => { if (e.key >= '0' && e.key <= '7') { setHeightSoot(Number(e.key)); setHeightSootOpen(false); } else if (e.key === 'Escape') setHeightSootOpen(false); }}>{[0,1,2,3,4,5,6,7].map(val => (<div key={val} onClick={() => { setHeightSoot(val); setHeightSootOpen(false); }} className={`px-4 py-2 text-center text-lg text-[var(--fg)] cursor-pointer transition-colors ${heightSoot === val ? 'bg-[var(--fg)]/20' : 'hover:bg-[var(--fg)]/10'}`}>{val}/8</div>))}</div>)}
                          </div>
                        </div>
                        {/* X */}
                        <div className="flex items-center justify-center w-20"><span className="text-5xl text-[var(--fg)] leading-none">X</span></div>
                        {/* Width column */}
                        <div className="flex flex-col w-32">
                          <div className="flex-1 border-b border-[var(--fg)]/50 flex items-center justify-center py-3">
                            <input type="number" value={width} onChange={(e) => { const v = e.target.value; if (v === '') { setWidth(''); setWidthWarning(null); return; } const n = Number(v); if (n > MAX_WIDTH) { setWidthWarning(`Max ${MAX_WIDTH}"`); setWidth(MAX_WIDTH); } else { setWidthWarning(null); setWidth(n); } }} className="text-center bg-transparent px-2 py-1 text-lg text-[var(--fg)] focus:outline-none mx-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="30" style={{ MozAppearance: 'textfield' }} />
                          </div>
                          <div ref={widthSootRef} className="flex-1 flex items-center justify-center py-3 relative cursor-pointer hover:bg-[var(--fg)]/5 transition-colors" onClick={() => setWidthSootOpen(!widthSootOpen)} tabIndex={0}>
                            <div className="text-lg text-[var(--fg)]">{widthSoot}/8</div>
                            <div className={`absolute right-2 transition-transform ${widthSootOpen ? 'rotate-180' : ''}`}><svg className="w-4 h-4 text-[var(--fg)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                            {widthSootOpen && (<div ref={widthSootMenuRef} className="absolute top-full left-0 right-0 mt-1 z-50 border border-[var(--fg)]/20 rounded shadow-lg overflow-hidden max-h-48 overflow-y-auto outline-none" style={{ backgroundColor: 'var(--bg)' }} tabIndex={0} onKeyDown={(e) => { if (e.key >= '0' && e.key <= '7') { setWidthSoot(Number(e.key)); setWidthSootOpen(false); } else if (e.key === 'Escape') setWidthSootOpen(false); }}>{[0,1,2,3,4,5,6,7].map(val => (<div key={val} onClick={() => { setWidthSoot(val); setWidthSootOpen(false); }} className={`px-4 py-2 text-center text-lg text-[var(--fg)] cursor-pointer transition-colors ${widthSoot === val ? 'bg-[var(--fg)]/20' : 'hover:bg-[var(--fg)]/10'}`}>{val}/8</div>))}</div>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── MOBILE layout: X spans 2 rows, labels inside ── */}
                  <div className="flex sm:hidden w-full">
                    <div className="w-full border border-[var(--fg)]/80 rounded" style={{ backgroundColor: 'var(--box-bg)' }}>
                      {/* Header row */}
                      <div className="grid border-b border-[var(--fg)]/80" style={{ gridTemplateColumns: '3rem 1fr 3rem 1fr' }}>
                        <div className="border-r border-[var(--fg)]/80" />
                        <div className="text-center text-sm text-[var(--fg)] py-2 border-r border-[var(--fg)]/80">Height</div>
                        <div className="border-r border-[var(--fg)]/80" />
                        <div className="text-center text-sm text-[var(--fg)] py-2">Width</div>
                      </div>
                      {/* Input area: 4 cols, X spans rows 1-2 */}
                      <div className="grid" style={{ gridTemplateColumns: '3rem 1fr 3rem 1fr', gridTemplateRows: 'auto auto' }}>
                        {/* Inch label */}
                        <div className="flex items-center justify-center text-sm text-[var(--fg)] border-b border-r border-[var(--fg)]/80">Inch</div>
                        {/* Inch Height input */}
                        <div className="flex items-center justify-center py-4 border-b border-r border-[var(--fg)]/80">
                          <input type="number" value={height} onChange={(e) => { const v = e.target.value; if (v === '') { setHeight(''); setHeightWarning(null); return; } const n = Number(v); if (n > MAX_HEIGHT) { setHeightWarning(`Max ${MAX_HEIGHT}"`); setHeight(MAX_HEIGHT); } else { setHeightWarning(null); setHeight(n); } }} className="w-full text-center bg-transparent text-xl text-[var(--fg)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="65" style={{ MozAppearance: 'textfield' }} />
                        </div>
                        {/* X — spans 2 rows */}
                        <div className="flex items-center justify-center border-r border-[var(--fg)]/80 text-4xl text-[var(--fg)]" style={{ gridRow: 'span 2' }}>X</div>
                        {/* Inch Width input */}
                        <div className="flex items-center justify-center py-4 border-b border-[var(--fg)]/80">
                          <input type="number" value={width} onChange={(e) => { const v = e.target.value; if (v === '') { setWidth(''); setWidthWarning(null); return; } const n = Number(v); if (n > MAX_WIDTH) { setWidthWarning(`Max ${MAX_WIDTH}"`); setWidth(MAX_WIDTH); } else { setWidthWarning(null); setWidth(n); } }} className="w-full text-center bg-transparent text-xl text-[var(--fg)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="30" style={{ MozAppearance: 'textfield' }} />
                        </div>
                        {/* Soot label */}
                        <div className="flex items-center justify-center text-sm text-[var(--fg)] border-r border-[var(--fg)]/80">Soot</div>
                        {/* Soot Height dropdown */}
                        <div className="flex items-center justify-center py-4 border-r border-[var(--fg)]/80 relative cursor-pointer hover:bg-[var(--fg)]/5" onClick={() => setHeightSootOpen(!heightSootOpen)} tabIndex={0}>
                          <span className="text-lg text-[var(--fg)]">{heightSoot}/8</span>
                          <div className={`absolute right-2 transition-transform ${heightSootOpen ? 'rotate-180' : ''}`}><svg className="w-4 h-4 text-[var(--fg)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></div>
                          {heightSootOpen && <div className="absolute top-full left-0 right-0 mt-1 z-50 border border-[var(--fg)]/20 rounded shadow-lg overflow-hidden max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--bg)' }}>{[0,1,2,3,4,5,6,7].map(val => <div key={val} onClick={() => { setHeightSoot(val); setHeightSootOpen(false); }} className={`px-4 py-2 text-center text-lg text-[var(--fg)] cursor-pointer ${heightSoot === val ? 'bg-[var(--fg)]/20' : 'hover:bg-[var(--fg)]/10'}`}>{val}/8</div>)}</div>}
                        </div>
                        {/* Soot Width dropdown */}
                        <div className="flex items-center justify-center py-4 relative cursor-pointer hover:bg-[var(--fg)]/5" onClick={() => setWidthSootOpen(!widthSootOpen)} tabIndex={0}>
                          <span className="text-lg text-[var(--fg)]">{widthSoot}/8</span>
                          <div className={`absolute right-2 transition-transform ${widthSootOpen ? 'rotate-180' : ''}`}><svg className="w-4 h-4 text-[var(--fg)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></div>
                          {widthSootOpen && <div className="absolute top-full left-0 right-0 mt-1 z-50 border border-[var(--fg)]/20 rounded shadow-lg overflow-hidden max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--bg)' }}>{[0,1,2,3,4,5,6,7].map(val => <div key={val} onClick={() => { setWidthSoot(val); setWidthSootOpen(false); }} className={`px-4 py-2 text-center text-lg text-[var(--fg)] cursor-pointer ${widthSoot === val ? 'bg-[var(--fg)]/20' : 'hover:bg-[var(--fg)]/10'}`}>{val}/8</div>)}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Thickness Grid Section */}
                <div className="flex flex-col items-center w-full sm:w-auto">
                  <div className="mb-2 text-center">
                    <span className="text-sm text-[var(--fg)]">Thickness</span>
                  </div>
                  <div className="flex flex-col border border-[var(--fg)]/80 divide-y divide-[var(--fg)]/80 rounded w-full sm:w-44" style={{ backgroundColor: 'var(--box-bg)' }}>
                    <button
                      onClick={() => setSelectedThickness('1.2 MM')}
                      className={`h-12 px-3 transition-colors text-sm flex items-center justify-center ${
                        selectedThickness === '1.2 MM' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'hover:bg-[var(--fg)]/10 text-[var(--fg)]'
                      }`}
                    >
                      1.2 MM
                    </button>
                    <button
                      onClick={() => setSelectedThickness('1.6 MM')}
                      className={`h-12 px-3 transition-colors text-sm flex items-center justify-center ${
                        selectedThickness === '1.6 MM' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'hover:bg-[var(--fg)]/10 text-[var(--fg)]'
                      }`}
                    >
                      1.6 MM
                    </button>
                    <button
                      onClick={() => setSelectedThickness('1.2 MM Hindalco')}
                      className={`h-12 px-3 transition-colors text-sm flex flex-col items-center justify-center ${
                        selectedThickness === '1.2 MM Hindalco' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'hover:bg-[var(--fg)]/10 text-[var(--fg)]'
                      }`}
                    >
                      <div>1.2 MM</div>
                      <div className="text-[10px] opacity-80">(Hindalco)</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Options Section */}
              <div className="w-full">
                <div className="mb-2 flex items-center justify-center">
                  <span className="text-sm text-[var(--fg)]">Options</span>
                </div>
                <div className="border border-[var(--muted)]/20 p-4 sm:p-6 rounded-lg flex flex-col w-full" style={{ backgroundColor: 'var(--box-bg)' }}>
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
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    className="px-4 py-3 border-2 border-[var(--muted)]/30 text-[var(--fg)] hover:border-[var(--accent)] transition-colors rounded font-medium"
                    style={{ backgroundColor: 'var(--box-bg)' }}
                  >
                    <div className="text-xs text-[var(--muted)] mb-1">Total</div>
                    <div className="text-lg font-bold text-[var(--accent)]">
                      ₹{Math.round(calculations.total + calculations.addonsTotal)}
                    </div>
                  </button>
                  {/* <button New — commented out */}
                  {/* <button
                    onClick={() => { ... }}
                  >New</button> */}
                  <button
                    onClick={() => {
                      const heightStr = height === '' ? '0' : height.toString()
                      const widthStr = width === '' ? '0' : width.toString()
                      const heightDisplay = heightSoot > 0 ? `${heightStr}" ${heightSoot}/8"` : `${heightStr}"`
                      const widthDisplay = widthSoot > 0 ? `${widthStr}" ${widthSoot}/8"` : `${widthStr}"`
                      const specsParts = [
                        `Height: ${heightDisplay} × Width: ${widthDisplay}`,
                        `Thickness: ${selectedThickness}`,
                      ]
                      const options = []
                      if (chaukhat) options.push('Chaukhat')
                      if (accessories) options.push('Accessories')
                      if (decorFilm) options.push('Decor Film')
                      if (brownCoated) options.push('Brown Coated')
                      if (options.length > 0) specsParts.push(`Options: ${options.join(', ')}`)
                      const specifications = specsParts.join(' | ')
                      const totalPrice = Math.round(calculations.total + calculations.addonsTotal)
                      addToCart({
                        type: 'aluminium-door',
                        name: 'Aluminium Door',
                        specifications,
                        price: totalPrice,
                        height,
                        width,
                        heightSoot,
                        widthSoot,
                        thickness: selectedThickness,
                        chaukhat,
                        accessories,
                        decorFilm,
                        brownCoated,
                      })
                      setAddedToCart(true)
                      setTimeout(() => setAddedToCart(false), 1500)
                    }}
                    className={`px-4 py-3 border-2 rounded font-medium transition-all duration-200 active:scale-95 ${
                      addedToCart
                        ? 'border-green-500 bg-green-500 text-white scale-95'
                        : 'border-[var(--accent)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]'
                    }`}
                    style={addedToCart ? {} : { backgroundColor: 'var(--box-bg)' }}
                  >
                    {addedToCart ? (
                      <span className="flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Added
                      </span>
                    ) : 'Add To Cart'}
                  </button>
                </div>

                {/* D1, D2, D3 — commented out */}
                {/* <div className="mt-3 p-3 border border-[var(--muted)]/20 rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--box-bg-track)' }}>
                  <div className="flex gap-3 justify-start">
                    <button>D1</button>
                    <button>D2</button>
                    <button>D3</button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
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
