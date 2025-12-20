'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal

  return (
    <main className="min-h-screen bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'url(/assets/texture-stone-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--fg)]">
              Shopping Cart
            </h1>
            <p className="text-lg text-[var(--muted)] mb-12">
              Review your items and proceed to checkout.
            </p>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <svg 
                  className="w-24 h-24 mx-auto mb-6 text-[var(--muted)]/40" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Your cart is empty</h2>
                <p className="text-[var(--muted)] mb-8">Add items to your cart to get started.</p>
                <Link 
                  href="/#collections"
                  className="inline-block px-6 py-3 bg-[var(--fg)] text-[var(--bg)] rounded transition-all duration-300 hover:opacity-90 hover-scale"
                >
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="border border-[var(--fg)]/20 rounded-lg p-6 hover:border-[var(--fg)]/40 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded overflow-hidden border border-[var(--fg)]/10">
                          <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)]/40">
                            <svg 
                              className="w-12 h-12" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2 text-[var(--fg)]">
                              {item.name}
                            </h3>
                            <p className="text-sm text-[var(--muted)] mb-4">
                              {item.specifications}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <label className="text-sm text-[var(--muted)]">Quantity:</label>
                              <div className="flex items-center gap-2 border border-[var(--fg)]/20 rounded">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 text-[var(--fg)] hover:bg-[var(--fg)]/10 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="px-4 py-1 text-[var(--fg)] min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 text-[var(--fg)] hover:bg-[var(--fg)]/10 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors mb-4"
                              aria-label="Remove item"
                            >
                              <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                />
                              </svg>
                            </button>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[var(--fg)]">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-[var(--muted)]">
                                  ₹{item.price.toLocaleString('en-IN')} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="border border-[var(--fg)]/20 rounded-lg p-6 sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--fg)]">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-xl font-bold text-[var(--fg)]">
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      className="w-full px-6 py-3 bg-[var(--fg)] text-[var(--bg)] rounded transition-all duration-300 hover:opacity-90 hover-scale font-semibold mb-4"
                    >
                      Proceed to Checkout
                    </button>

                    <Link
                      href="/#collections"
                      className="block w-full text-center px-6 py-3 border border-[var(--fg)]/20 text-[var(--fg)] rounded transition-all duration-300 hover:border-[var(--fg)]/40 hover-scale"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </main>
  )
}

