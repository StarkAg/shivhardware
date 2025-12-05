'use client'

import { useMemo, useState } from 'react'
import {
  calculateAluminiumDoor,
  aluminiumDoorRates,
  type AluminiumDoorThickness,
} from '@/lib/calculators'

export default function AluminiumDoorPage() {
  const [height, setHeight] = useState(70)
  const [width, setWidth] = useState(83)
  const [heightSoot, setHeightSoot] = useState(7)
  const [widthSoot, setWidthSoot] = useState(1)
  const [chaukhat, setChaukhat] = useState(true)
  const [accessories, setAccessories] = useState(true)
  const [decorFilm, setDecorFilm] = useState(false)
  const [brownCoated, setBrownCoated] = useState(false)
  const [selectedThickness, setSelectedThickness] = useState<AluminiumDoorThickness>('1.2 MM')

  const calculations = useMemo(() => {
    return calculateAluminiumDoor({
      height,
      width,
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

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] pt-24 pb-16 sm:py-20 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'url(/assets/texture-wood-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Side - Door Diagram */}
            <div className="space-y-6">
              <div className="border border-[var(--muted)]/20 p-8 bg-black/20 backdrop-blur-sm rounded-lg">
                <h3 className="text-xl font-bold mb-6 text-[var(--fg)] text-center">Door Dimensions</h3>
                
                {/* Door Visual */}
                <div className="relative mx-auto mb-8" style={{ maxWidth: '400px' }}>
                  <div 
                    className="relative border-4 border-[var(--muted)]/40 bg-[var(--muted)]/5 mx-auto"
                    style={{
                      width: '100%',
                      aspectRatio: `${calculations.widthInch} / ${calculations.heightInch}`,
                      maxHeight: '400px',
                    }}
                  >
                    {/* Door Handle */}
                    <div 
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <div className="w-2 h-8 bg-[var(--muted)]/60 rounded-full"></div>
                      <div className="w-6 h-1 bg-[var(--muted)]/60 rounded-full -mt-1 ml-1"></div>
                    </div>

                    {/* Height Dimension - Left Side */}
                    <div className="absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center">
                      <div className="flex-1 border-l-2 border-[var(--accent)]"></div>
                      <div className="px-2 py-1 bg-[var(--bg)] border border-[var(--muted)]/30 rounded text-xs font-medium text-[var(--fg)] whitespace-nowrap">
                        {calculations.heightDisplay}
                      </div>
                      <div className="flex-1 border-l-2 border-[var(--accent)]"></div>
                    </div>

                    {/* Width Dimension - Bottom */}
                    <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center">
                      <div className="flex-1 border-t-2 border-[var(--accent)]"></div>
                      <div className="px-2 py-1 bg-[var(--bg)] border border-[var(--muted)]/30 rounded text-xs font-medium text-[var(--fg)] whitespace-nowrap mx-2">
                        {calculations.widthDisplay}
                      </div>
                      <div className="flex-1 border-t-2 border-[var(--accent)]"></div>
                    </div>
                  </div>
                </div>

                {/* Area Display */}
                <div className="text-center p-4 bg-[var(--muted)]/10 border border-[var(--muted)]/20 rounded">
                  <p className="text-sm text-[var(--muted)] mb-1">Area</p>
                  <p className="text-2xl font-bold text-[var(--fg)]">{areaInM2} m²</p>
                  <p className="text-sm text-[var(--muted)] mt-1">({calculations.area} Sqft)</p>
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
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="flex-1 border border-[var(--muted)]/30 bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors rounded"
                      placeholder="70"
                    />
                    <select
                      value={heightSoot}
                      onChange={(e) => setHeightSoot(Number(e.target.value))}
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
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="flex-1 border border-[var(--muted)]/30 bg-[var(--bg)] px-4 py-3 text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none transition-colors rounded"
                      placeholder="83"
                    />
                    <select
                      value={widthSoot}
                      onChange={(e) => setWidthSoot(Number(e.target.value))}
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
                <label className="block text-sm font-medium mb-3 text-[var(--fg)]">Thickness</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedThickness('1.2 MM')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                      selectedThickness === '1.2 MM'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'border-[var(--muted)]/30 text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    1.2 MM
                  </button>
                  <button
                    onClick={() => setSelectedThickness('1.6 MM')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                      selectedThickness === '1.6 MM'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'border-[var(--muted)]/30 text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    1.6 MM
                  </button>
                  <button
                    onClick={() => setSelectedThickness('1.2 MM Hindalco')}
                    className={`flex-1 px-4 py-3 border-2 rounded transition-colors ${
                      selectedThickness === '1.2 MM Hindalco'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'border-[var(--muted)]/30 text-[var(--fg)] hover:border-[var(--muted)]/50'
                    }`}
                  >
                    1.6 Hindalco
                  </button>
                </div>
              </div>

              {/* Options Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-[var(--fg)]">Options →</h3>
                <div className="space-y-3 border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={chaukhat}
                      onChange={(e) => setChaukhat(e.target.checked)}
                      className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                    />
                    <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">in Chaukhat</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={accessories}
                      onChange={(e) => setAccessories(e.target.checked)}
                      className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                    />
                    <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Accessories</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={decorFilm}
                      onChange={(e) => setDecorFilm(e.target.checked)}
                      className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                    />
                    <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Decor Film</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={brownCoated}
                      onChange={(e) => setBrownCoated(e.target.checked)}
                      className="w-5 h-5 border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)] rounded cursor-pointer"
                    />
                    <span className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">Brown Coated</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm rounded-lg">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Net Area</p>
              <p className="text-3xl font-bold text-[var(--fg)]">{calculations.area} Sqft</p>
            </div>
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm rounded-lg">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Chaukhat Rft</p>
              <p className="text-3xl font-bold text-[var(--fg)]">{calculations.chaukhatRft}</p>
            </div>
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm rounded-lg">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Hardware Kit</p>
              <p className="text-3xl font-bold text-[var(--fg)]">₹{accessories ? 160 : 0}</p>
            </div>
            <div className="border border-[var(--muted)]/20 p-6 bg-black/20 backdrop-blur-sm rounded-lg border-[var(--accent)]/50">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Total</p>
              <p className="text-3xl font-bold text-[var(--accent)]">₹{Math.round(calculations.total)}</p>
            </div>
          </div>

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
                  <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Chaukhat</td>
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
                        <td className="border-r border-[var(--muted)]/20 p-4 text-[var(--fg)]">Brown Coated</td>
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
                <span className="font-bold">Chaukhat:</span> {calculations.chaukhatRft} Rft
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
        </div>
      </section>
    </main>
  )
}
