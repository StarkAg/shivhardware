'use client'

import { useMemo, useState } from 'react'
import Hero from '@/components/Hero'
import {
  calculateWindow3Track,
  window3TrackBaseRates,
  type Window3TrackThickness,
  type GlassType,
} from '@/lib/calculators'

export default function Window3TrackPage() {
  const [height, setHeight] = useState(60)
  const [width, setWidth] = useState(48)
  const [heightSoot, setHeightSoot] = useState(0)
  const [widthSoot, setWidthSoot] = useState(0)
  const [selectedThickness, setSelectedThickness] = useState<Window3TrackThickness>('1.2 mm')
  const [glassType, setGlassType] = useState<GlassType>('clear')
  const [chaukhat, setChaukhat] = useState(true)
  const [decorFilm, setDecorFilm] = useState(false)
  const [ssNet, setSsNet] = useState(false)
  const [brownCoated, setBrownCoated] = useState(false)

  const calculations = useMemo(() => {
    return calculateWindow3Track({
      height,
      width,
      heightSoot,
      widthSoot,
      selectedThickness,
      glassType,
      chaukhat,
      decorFilm,
      ssNet,
      brownCoated,
    })
  }, [height, width, heightSoot, widthSoot, selectedThickness, glassType, chaukhat, decorFilm, ssNet, brownCoated])

  return (
    <main className="min-h-screen">
      <Hero
        title="3 Track Window Calculator"
        subtitle="Calculate pricing for 3 track aluminium sliding windows with half SS net and all customization options."
        mediaType="image"
        mediaSrc="/assets/showroom-1.jpg"
        ctas={[
          { text: 'View Collections', href: '/collections', variant: 'primary' },
          { text: 'All Calculators', href: '/calculators', variant: 'secondary' },
        ]}
      />

      <section className="bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'url(/assets/texture-wood-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Area</p>
              <p className="text-3xl font-bold text-[var(--fg)]">{calculations.area} Sqft</p>
            </div>
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Glass Rate</p>
              <p className="text-3xl font-bold text-[var(--fg)]">₹{calculations.glassRate}/sqft</p>
            </div>
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Base Cost</p>
              <p className="text-3xl font-bold text-[var(--fg)]">₹{Math.round(calculations.total)}</p>
            </div>
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Total</p>
              <p className="text-3xl font-bold text-[var(--fg)]">₹{Math.round(calculations.total + calculations.addonsTotal)}</p>
            </div>
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--fg)]">Height</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full border border-[var(--muted)]/30 bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                  <select
                    value={heightSoot}
                    onChange={(e) => setHeightSoot(Number(e.target.value))}
                    className="w-24 border border-[var(--muted)]/30 bg-[var(--bg)] px-3 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors"
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
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full border border-[var(--muted)]/30 bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                  <select
                    value={widthSoot}
                    onChange={(e) => setWidthSoot(Number(e.target.value))}
                    className="w-24 border border-[var(--muted)]/30 bg-[var(--bg)] px-3 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors"
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--fg)]">Thickness</label>
                <select
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(e.target.value as Window3TrackThickness)}
                  className="w-full border border-[var(--muted)]/30 bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                >
                  <option value="1.2 mm">1.2 mm</option>
                  <option value="1.6 mm">1.6 mm</option>
                  <option value="1.2 mm Hindalco">1.2 mm Hindalco</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--fg)]">Glass Type</label>
                <select
                  value={glassType}
                  onChange={(e) => setGlassType(e.target.value as GlassType)}
                  className="w-full border border-[var(--muted)]/30 bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                >
                  <option value="clear">Clear</option>
                  <option value="reflective">Reflective</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chaukhat}
                    onChange={(e) => setChaukhat(e.target.checked)}
                    className="w-4 h-4 border-[var(--muted)]/30 bg-[var(--bg)]"
                  />
                  <span className="text-[var(--fg)]">Chaukhat</span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4 text-[var(--fg)]">Add-ons</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={decorFilm}
                      onChange={(e) => setDecorFilm(e.target.checked)}
                      className="w-4 h-4 border-[var(--muted)]/30 bg-[var(--bg)]"
                    />
                    <span className="text-[var(--fg)]">Décor Film</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ssNet}
                      onChange={(e) => setSsNet(e.target.checked)}
                      className="w-4 h-4 border-[var(--muted)]/30 bg-[var(--bg)]"
                    />
                    <span className="text-[var(--fg)]">SS Net (Half)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brownCoated}
                      onChange={(e) => setBrownCoated(e.target.checked)}
                      className="w-4 h-4 border-[var(--muted)]/30 bg-[var(--bg)]"
                    />
                    <span className="text-[var(--fg)]">Brown Coated</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="border border-[var(--muted)]/20 overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--muted)]/20">
                  <th className="border-r border-[var(--muted)]/20 p-4 text-left text-[var(--fg)]">Item</th>
                  <th className="p-4 text-center text-[var(--fg)]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Area</td>
                  <td className="p-4 text-center text-[var(--fg)]">{calculations.area} Sqft</td>
                </tr>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Base Rate</td>
                  <td className="p-4 text-center text-[var(--fg)]">₹{calculations.baseRate}/sqft</td>
                </tr>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Glass Rate</td>
                  <td className="p-4 text-center text-[var(--fg)]">₹{calculations.glassRate}/sqft</td>
                </tr>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Glass Cost</td>
                  <td className="p-4 text-center text-[var(--fg)]">₹{Math.round(calculations.glassCost)}</td>
                </tr>
                <tr className="border-b border-[var(--muted)]/10">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Chaukhat</td>
                  <td className="p-4 text-center text-[var(--fg)]">
                    {chaukhat ? `₹${Math.round(calculations.chaukhatCost)}` : 'Not Selected'}
                  </td>
                </tr>
                {(decorFilm || ssNet || brownCoated) && (
                  <>
                    {decorFilm && (
                      <tr className="border-b border-[var(--muted)]/10">
                        <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Décor Film</td>
                        <td className="p-4 text-center text-[var(--fg)]">₹{Math.round(calculations.decorFilmCost)}</td>
                      </tr>
                    )}
                    {ssNet && (
                      <tr className="border-b border-[var(--muted)]/10">
                        <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">SS Net (Half)</td>
                        <td className="p-4 text-center text-[var(--fg)]">₹{Math.round(calculations.ssNetCost)}</td>
                      </tr>
                    )}
                    {brownCoated && (
                      <tr className="border-b border-[var(--muted)]/10">
                        <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Brown Coated</td>
                        <td className="p-4 text-center text-[var(--fg)]">₹{Math.round(calculations.brownCoatedCost)}</td>
                      </tr>
                    )}
                  </>
                )}
                <tr className="border-t-2 border-[var(--muted)]/30 font-bold">
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Total</td>
                  <td className="p-4 text-center text-[var(--fg)]">
                    ₹{Math.round(calculations.total + calculations.addonsTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Print Section */}
          <div className="border border-[var(--muted)]/20 p-8 bg-black/20 backdrop-blur-sm">
            <div className="space-y-2 mb-6">
              <p className="text-[var(--fg)]">
                <span className="font-bold">Size:</span> {calculations.sizeDisplay}
              </p>
              <p className="text-[var(--fg)]">
                <span className="font-bold">Area:</span> {calculations.area} Sqft
              </p>
              <p className="text-[var(--fg)]">
                <span className="font-bold">Thickness:</span> {selectedThickness}
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
                className="bg-[var(--accent)] text-[var(--bg)] px-8 py-4 font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale"
              >
                Print Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

