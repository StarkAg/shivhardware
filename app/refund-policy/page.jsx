import Link from 'next/link'

export const metadata = {
  title: 'Refund Policy — Shiv Hardware Store',
  description: 'Refund and return policy for Shiv Hardware Store.',
}

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
              Refund Policy
            </h1>
            <p className="text-lg text-[var(--muted)] mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none space-y-8 text-[var(--muted)]">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Returns</h2>
                <p>
                  We want you to be completely satisfied with your purchase. If you are not satisfied with your order, 
                  you may return it within 7 days of delivery for a full refund or exchange.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Return Conditions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items must be unused and in their original packaging</li>
                  <li>Items must be in the same condition as when received</li>
                  <li>Proof of purchase is required</li>
                  <li>Custom or made-to-order items are not eligible for return</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Refund Process</h2>
                <p>
                  Once we receive your returned item, we will inspect it and notify you of the status of your refund. 
                  If approved, your refund will be processed within 5-7 business days to your original payment method.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Shipping Costs</h2>
                <p>
                  Return shipping costs are the responsibility of the customer unless the item was defective or we made an error.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Contact Us</h2>
                <p>
                  If you have any questions about our refund policy, please{' '}
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

