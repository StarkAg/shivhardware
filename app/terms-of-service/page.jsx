import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Shiv Hardware Store',
  description: 'Terms of service for Shiv Hardware Store.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
              Terms of Service
            </h1>
            <p className="text-lg text-[var(--muted)] mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none space-y-8 text-[var(--muted)]">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Agreement to Terms</h2>
                <p>
                  By accessing or using our website, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access our service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Use of Website</h2>
                <p>You agree to use our website only for lawful purposes and in a way that does not:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Infringe on the rights of others</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with or disrupt the website</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Product Information</h2>
                <p>
                  We strive to provide accurate product information, but we do not warrant that product 
                  descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Pricing</h2>
                <p>
                  All prices are subject to change without notice. We reserve the right to modify prices 
                  at any time. Prices do not include shipping and handling charges unless otherwise stated.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Shiv Hardware Store shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages resulting from your use 
                  of our website or products.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please{' '}
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

