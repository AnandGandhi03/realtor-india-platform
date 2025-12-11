import { emailTemplates } from './templates'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    // Using Resend API (you can also use SendGrid, AWS SES, etc.)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Realtor India <noreply@realtorindiaplatform.com>',
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// Helper functions for specific email types
export const emailService = {
  sendWelcomeEmail: async (email: string, name: string) => {
    const template = emailTemplates.welcome(name)
    return sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })
  },

  sendPropertyListedEmail: async (email: string, name: string, propertyTitle: string, propertyId: string) => {
    const template = emailTemplates.propertyListed(name, propertyTitle, propertyId)
    return sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })
  },

  sendNewLeadEmail: async (
    ownerEmail: string,
    ownerName: string,
    leadName: string,
    leadPhone: string,
    leadEmail: string,
    propertyTitle: string,
    message: string
  ) => {
    const template = emailTemplates.newLead(ownerName, leadName, leadPhone, leadEmail, propertyTitle, message)
    return sendEmail({
      to: ownerEmail,
      subject: template.subject,
      html: template.html,
    })
  },

  sendViewingScheduledEmail: async (
    userEmail: string,
    userName: string,
    propertyTitle: string,
    dateTime: string,
    agentName: string,
    agentPhone: string
  ) => {
    const template = emailTemplates.viewingScheduled(userName, propertyTitle, dateTime, agentName, agentPhone)
    return sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
    })
  },

  sendSavedSearchAlert: async (userEmail: string, userName: string, newProperties: any[]) => {
    const template = emailTemplates.savedSearchAlert(userName, newProperties)
    return sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
    })
  },
}

// Supabase Edge Function alternative (for serverless email sending)
export async function sendEmailViaSupabase(params: SendEmailParams) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to send email via Supabase')
    }

    return { success: true }
  } catch (error) {
    console.error('Supabase email error:', error)
    return { success: false, error }
  }
}