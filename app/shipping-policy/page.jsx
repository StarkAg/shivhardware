import Link from 'next/link'

export const metadata = {
  title: 'Shipping Policy — Shiv Hardware Store',
  description: 'Shipping and delivery policy for Shiv Hardware Store.',
}

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
              Shipping Policy
            </h1>
            <p className="text-lg text-[var(--muted)] mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none space-y-8 text-[var(--muted)]">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Shipping Methods</h2>
                <p>
                  We offer various shipping options to meet your needs. Shipping costs and delivery times 
                  vary based on the shipping method selected and your location.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Standard Shipping: 5-7 business days</li>
                  <li>Express Shipping: 2-3 business days</li>
                  <li>Same-day Delivery: Available in select areas</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Processing Time</h2>
                <p>
                  Orders are typically processed within 1-2 business days. Custom or made-to-order items 
                  may require additional processing time, which will be communicated at the time of order.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Shipping Costs</h2>
                <p>
                  Shipping costs are calculated at checkout based on the weight, dimensions, and destination 
                  of your order. Free shipping may be available for orders above a certain value.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Delivery</h2>
                <p>
                  Once your order ships, you will receive a tracking number via email. You can use this 
                  to track your package's progress. Delivery times are estimates and may vary due to 
                  factors beyond our control.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">International Shipping</h2>
                <p>
                  We currently ship within India. For international shipping inquiries, please{' '}
                  <Link href="/contact" className="text-[var(--accent)] hover:underline">
                    contact us
                  </Link>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Damaged or Lost Items</h2>
                <p>
                  If your order arrives damaged or is lost in transit, please{' '}
                  <Link href="/contact" className="text-[var(--accent)] hover:underline">
                    contact us
                  </Link>{' '}
                  immediately. We will work with you to resolve the issue promptly.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Contact Us</h2>
                <p>
                  If you have any questions about our shipping policy, please{' '}
                  <Link href="/contact" className="text-[var(--accent)] hover:underline">
                    contact us
                  </Link>.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--muted)]/20">
              <Link
                href="/contact"
                className="inline-block border border-[var(--accent)] text-[var(--accent)] px-8 py-4 font-medium hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

