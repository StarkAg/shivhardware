import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Shiv Hardware Store',
  description: 'Privacy policy for Shiv Hardware Store.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--fg)]">
              Privacy Policy
            </h1>
            <p className="text-lg text-[var(--muted)] mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none space-y-8 text-[var(--muted)]">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us, including when you create an account, 
                  make a purchase, contact us, or subscribe to our newsletter.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Name and contact information</li>
                  <li>Payment information</li>
                  <li>Shipping address</li>
                  <li>Order history</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our services and website</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Information Sharing</h2>
                <p>
                  We do not sell your personal information. We may share your information with service providers 
                  who assist us in operating our website and conducting our business, as long as they agree to 
                  keep your information confidential.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. However, 
                  no method of transmission over the Internet is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-[var(--fg)]">Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy, please{' '}
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

