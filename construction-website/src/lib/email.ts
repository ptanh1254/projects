import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@company.com'
const FROM_EMAIL = 'noreply@resend.dev' // Use your verified domain later
const COMPANY_NAME = process.env.COMPANY_NAME || 'Construction Company'

// Send notification when a new quote is received
export async function sendQuoteNotification(data: {
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  area?: number
  budget?: string
  timeline?: string
  message?: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Website] New Quote Request from ${data.name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        ${data.area ? `<p><strong>Area:</strong> ${data.area} m²</p>` : ''}
        ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
        ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending quote notification:', error)
    return { success: false, error }
  }
}

// Send notification when a contact message is received
export async function sendContactNotification(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Website] New Message from ${data.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending contact notification:', error)
    return { success: false, error }
  }
}

// Send automatic reply email
export async function sendAutoReply(data: {
  to: string
  name: string
  type: 'quote' | 'contact'
}) {
  const subject = data.type === 'quote'
    ? 'Thank you for your quote request'
    : 'Thank you for contacting us'

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: subject,
      html: `
        <p>Hello ${data.name},</p>
        <p>Thank you for your interest in our services!</p>
        <p>We have received your ${data.type === 'quote' ? 'quote request' : 'message'} and will respond within 24 hours.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>${COMPANY_NAME}</strong></p>
        <p>Phone: ${process.env.COMPANY_PHONE || '(000) 000-0000'}</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending auto reply:', error)
    return { success: false, error }
  }
}