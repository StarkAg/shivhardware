export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Log the payload (in production, you'd send this to an email service, database, etc.)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      message: formData.get('message'),
      file: formData.get('file')?.name || null,
    }
    
    console.log('Contact form submission:', data)
    
    // In production, you would:
    // - Send email via SendGrid, Resend, etc.
    // - Save to database
    // - Send notification
    
    return Response.json({ 
      success: true,
      message: 'Thank you for your message. We\'ll get back to you soon.' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

