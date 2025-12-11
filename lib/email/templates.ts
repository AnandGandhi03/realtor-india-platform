export const emailTemplates = {
  // Welcome email for new users
  welcome: (name: string) => ({
    subject: 'Welcome to Realtor India! 🏠',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Realtor India!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for joining Realtor India - your trusted partner in finding the perfect property!</p>
              
              <p>Here's what you can do now:</p>
              <ul>
                <li>Browse thousands of verified properties</li>
                <li>Save your favorite listings</li>
                <li>Schedule property viewings</li>
                <li>Get personalized recommendations</li>
              </ul>

              <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties" class="button">
                Start Browsing Properties
              </a>

              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Happy house hunting!</p>
              <p><strong>Team Realtor India</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Realtor India. All rights reserved.</p>
              <p>You're receiving this email because you signed up for Realtor India.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Property listing confirmation
  propertyListed: (name: string, propertyTitle: string, propertyId: string) => ({
    subject: 'Your Property is Listed! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .property-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Property Listed Successfully!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Great news! Your property has been successfully listed on Realtor India.</p>
              
              <div class="property-box">
                <h3>${propertyTitle}</h3>
                <p><strong>Status:</strong> Pending Approval</p>
                <p>Our team will review your listing within 24 hours. Once approved, it will be visible to thousands of potential buyers/renters.</p>
              </div>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team reviews your listing for quality and accuracy</li>
                <li>You'll receive a notification once approved</li>
                <li>Your property will be featured on our platform</li>
                <li>You'll start receiving inquiries from interested buyers</li>
              </ul>

              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-properties" class="button">
                View My Properties
              </a>

              <p>Thank you for choosing Realtor India!</p>
              <p><strong>Team Realtor India</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Realtor India. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // New lead notification for property owner
  newLead: (ownerName: string, leadName: string, leadPhone: string, leadEmail: string, propertyTitle: string, message: string) => ({
    subject: `New Inquiry for ${propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .lead-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .contact-info { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Property Inquiry!</h1>
            </div>
            <div class="content">
              <h2>Hi ${ownerName},</h2>
              <p>You have received a new inquiry for your property:</p>
              
              <div class="lead-box">
                <h3>${propertyTitle}</h3>
                
                <div class="contact-info">
                  <p><strong>Interested Buyer:</strong> ${leadName}</p>
                  <p><strong>Phone:</strong> <a href="tel:${leadPhone}">${leadPhone}</a></p>
                  <p><strong>Email:</strong> <a href="mailto:${leadEmail}">${leadEmail}</a></p>
                </div>

                ${message ? `
                  <p><strong>Message:</strong></p>
                  <p style="background: #f3f4f6; padding: 15px; border-radius: 5px; font-style: italic;">
                    "${message}"
                  </p>
                ` : ''}
              </div>

              <p><strong>Quick Tips:</strong></p>
              <ul>
                <li>Respond within 24 hours for best results</li>
                <li>Be professional and courteous</li>
                <li>Schedule a viewing at their convenience</li>
                <li>Answer all their questions clearly</li>
              </ul>

              <a href="tel:${leadPhone}" class="button">
                Call Now
              </a>

              <p>Good luck with your sale!</p>
              <p><strong>Team Realtor India</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Realtor India. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Viewing scheduled confirmation
  viewingScheduled: (userName: string, propertyTitle: string, dateTime: string, agentName: string, agentPhone: string) => ({
    subject: `Viewing Scheduled: ${propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .viewing-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
            .datetime { background: #ede9fe; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Viewing Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Your property viewing has been successfully scheduled.</p>
              
              <div class="viewing-box">
                <h3>${propertyTitle}</h3>
                
                <div class="datetime">
                  📅 ${dateTime}
                </div>

                <p><strong>Agent Details:</strong></p>
                <p>Name: ${agentName}</p>
                <p>Phone: <a href="tel:${agentPhone}">${agentPhone}</a></p>
              </div>

              <p><strong>Before the viewing:</strong></p>
              <ul>
                <li>Arrive 5-10 minutes early</li>
                <li>Prepare your questions in advance</li>
                <li>Bring a notepad or use your phone to take notes</li>
                <li>Check the property's surroundings</li>
              </ul>

              <p>If you need to reschedule, please contact the agent at least 24 hours in advance.</p>

              <a href="tel:${agentPhone}" class="button">
                Call Agent
              </a>

              <p>Looking forward to showing you the property!</p>
              <p><strong>Team Realtor India</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Realtor India. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Saved search alert
  savedSearchAlert: (userName: string, newProperties: any[]) => ({
    subject: `${newProperties.length} New Properties Match Your Search!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .property-card { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Properties Available!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>We found ${newProperties.length} new ${newProperties.length === 1 ? 'property' : 'properties'} matching your saved search criteria:</p>
              
              ${newProperties.slice(0, 3).map(property => `
                <div class="property-card">
                  <h3>${property.title}</h3>
                  <p><strong>Price:</strong> ₹${property.price.toLocaleString('en-IN')}</p>
                  <p><strong>Location:</strong> ${property.locality}, ${property.city}</p>
                  <p><strong>Type:</strong> ${property.bedrooms} BHK ${property.property_type}</p>
                </div>
              `).join('')}

              ${newProperties.length > 3 ? `<p>...and ${newProperties.length - 3} more!</p>` : ''}

              <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties" class="button">
                View All Properties
              </a>

              <p>Don't miss out on these opportunities!</p>
              <p><strong>Team Realtor India</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Realtor India. All rights reserved.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">Manage email preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}