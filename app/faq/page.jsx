export const metadata = {
  title: 'FAQ — Stara',
  description: 'Frequently asked questions about Stara doors, lead times, warranties, and installation services.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is the lead time for custom doors?',
      answer: '4–8 weeks depending on finish and quantity.',
    },
    {
      question: 'Do you offer on-site measurement?',
      answer: 'Yes — select "Measure & Install" in the contact form.',
    },
    {
      question: 'What warranties do you provide?',
      answer: '5 years on finish and 10 years on door core defects for most ranges. See product page for specifics.',
    },
  ]

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--bg)] py-16 sm:py-20 md:py-24 relative overflow-hidden">
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-[var(--fg)]">
              Frequently Asked Questions
            </h1>
            
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[var(--muted)]/20 pb-8 last:border-0">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--fg)]">
                    {faq.question}
                  </h2>
                  <p className="text-[var(--muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

