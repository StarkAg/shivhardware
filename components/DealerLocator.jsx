'use client'

import { useState, useEffect } from 'react'
import dealersData from '@/data/dealers.json'

export default function DealerLocator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDealers, setFilteredDealers] = useState(dealersData)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDealers(dealersData)
      return
    }

    const filtered = dealersData.filter(dealer =>
      dealer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDealers(filtered)
  }, [searchTerm])

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by city, name, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div className="space-y-6">
        {filteredDealers.length > 0 ? (
          filteredDealers.map((dealer, index) => (
            <div
              key={index}
              className="border border-[var(--muted)]/20 p-6 hover:border-[var(--accent)] transition-colors"
            >
              <h3 className="text-xl font-bold mb-2 text-[var(--fg)]">
                {dealer.name}
              </h3>
              <div className="space-y-1 text-[var(--muted)]">
                <p>{dealer.address}</p>
                <p>{dealer.city}</p>
                <p className="mt-2">
                  <a href={`tel:${dealer.phone}`} className="text-[var(--accent)] hover:underline">
                    {dealer.phone}
                  </a>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[var(--muted)] text-center py-8">
            No dealers found matching your search.
          </p>
        )}
      </div>
    </div>
  )
}

