'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    file: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  
  // Accessibility: aria-live region for form responses

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll get back to you soon.' })
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          message: '',
          file: null,
        })
      } else {
        setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-[var(--fg)]">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--fg)]">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2 text-[var(--fg)]">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-2 text-[var(--fg)]">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-[var(--fg)]">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium mb-2 text-[var(--fg)]">
          File Upload (optional)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--muted)]/30 bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Accessibility: aria-live region for form status */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {submitStatus?.message}
      </div>
      
      {submitStatus && (
        <div 
          className={`p-4 rounded-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          role="alert"
        >
          {submitStatus.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--accent)] text-[var(--bg)] px-6 py-4 font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

