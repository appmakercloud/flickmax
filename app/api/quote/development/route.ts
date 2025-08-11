import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Format the email content
    const emailContent = formatEmailContent(formData)

    // Send email using your preferred email service
    // For now, we'll log it and return success
    console.log('Quote Request:', emailContent)

    // In production, you would send this via:
    // 1. SendGrid API
    // 2. AWS SES
    // 3. Resend
    // 4. Or any other email service

    // Example with SendGrid (you'll need to install @sendgrid/mail):
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    const msg = {
      to: 'development@flickmax.com',
      from: 'noreply@flickmax.com',
      subject: `New Development Quote Request from ${formData.fullName}`,
      html: emailContent,
      text: emailContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
    }
    
    await sgMail.send(msg)
    */

    // For demonstration, we'll save to a local file or database
    // In production, you might also want to save to a database
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quote request submitted successfully' 
    })
  } catch (error) {
    console.error('Error processing quote request:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit quote request' },
      { status: 500 }
    )
  }
}

function formatEmailContent(data: any): string {
  const {
    fullName,
    email,
    phone,
    company,
    website,
    projectType,
    industry,
    projectDescription,
    features,
    existingWebsite,
    platforms,
    integrations,
    hosting,
    timeline,
    budget,
    startDate,
    competitors,
    additionalNotes,
    howDidYouHear
  } = data

  const formatDate = () => {
    return new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const formatBudget = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      '5k-10k': '$5,000 - $10,000',
      '10k-25k': '$10,000 - $25,000',
      '25k-50k': '$25,000 - $50,000',
      '50k-100k': '$50,000 - $100,000',
      '100k+': '$100,000+',
      'not-sure': 'Not specified'
    }
    return budgetMap[budget] || budget
  }

  const formatTimeline = (timeline: string) => {
    const timelineMap: { [key: string]: string } = {
      'asap': 'ASAP',
      '1month': 'Within 1 month',
      '2-3months': '2-3 months',
      '3-6months': '3-6 months',
      '6months+': '6+ months',
      'flexible': 'Flexible'
    }
    return timelineMap[timeline] || timeline
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .label { font-weight: bold; color: #555; margin-bottom: 5px; }
        .value { color: #333; margin-bottom: 15px; }
        .list-item { padding: 5px 0; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        .badge { display: inline-block; padding: 3px 8px; background: #e3f2fd; color: #1976d2; border-radius: 4px; margin: 2px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Development Quote Request</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Received on ${formatDate()}</p>
        </div>
        
        <div class="content">
          <!-- Contact Information -->
          <div class="section">
            <h2 style="color: #667eea; margin-top: 0;">Contact Information</h2>
            <div class="label">Name:</div>
            <div class="value">${fullName}</div>
            
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
            
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${phone}">${phone}</a></div>
            
            ${company ? `
              <div class="label">Company:</div>
              <div class="value">${company}</div>
            ` : ''}
            
            ${website ? `
              <div class="label">Current Website:</div>
              <div class="value"><a href="${website}" target="_blank">${website}</a></div>
            ` : ''}
          </div>

          <!-- Project Overview -->
          <div class="section">
            <h2 style="color: #667eea; margin-top: 0;">Project Overview</h2>
            
            <div class="label">Project Type:</div>
            <div class="value">
              ${projectType.map((type: string) => `<span class="badge">${type}</span>`).join(' ')}
            </div>
            
            <div class="label">Industry:</div>
            <div class="value">${industry}</div>
            
            <div class="label">Project Description:</div>
            <div class="value" style="white-space: pre-wrap;">${projectDescription}</div>
            
            ${existingWebsite ? `
              <div class="label">Existing Website/App:</div>
              <div class="value">${existingWebsite}</div>
            ` : ''}
          </div>

          <!-- Technical Requirements -->
          <div class="section">
            <h2 style="color: #667eea; margin-top: 0;">Technical Requirements</h2>
            
            <div class="label">Required Features:</div>
            <div class="value">
              ${features.length > 0 ? features.map((f: string) => `<span class="badge">${f}</span>`).join(' ') : 'None specified'}
            </div>
            
            <div class="label">Target Platforms:</div>
            <div class="value">
              ${platforms.map((p: string) => `<span class="badge">${p}</span>`).join(' ')}
            </div>
            
            ${integrations.length > 0 ? `
              <div class="label">Third-Party Integrations:</div>
              <div class="value">
                ${integrations.map((i: string) => `<span class="badge">${i}</span>`).join(' ')}
              </div>
            ` : ''}
            
            ${hosting ? `
              <div class="label">Hosting Preference:</div>
              <div class="value">${hosting}</div>
            ` : ''}
          </div>

          <!-- Timeline & Budget -->
          <div class="section">
            <h2 style="color: #667eea; margin-top: 0;">Timeline & Budget</h2>
            
            <div class="label">Timeline:</div>
            <div class="value">${formatTimeline(timeline)}</div>
            
            <div class="label">Budget Range:</div>
            <div class="value"><strong>${formatBudget(budget)}</strong></div>
            
            ${startDate ? `
              <div class="label">Preferred Start Date:</div>
              <div class="value">${new Date(startDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
            ` : ''}
          </div>

          <!-- Additional Information -->
          ${(competitors || additionalNotes || howDidYouHear) ? `
            <div class="section">
              <h2 style="color: #667eea; margin-top: 0;">Additional Information</h2>
              
              ${competitors ? `
                <div class="label">Competitor/Reference Sites:</div>
                <div class="value" style="white-space: pre-wrap;">${competitors}</div>
              ` : ''}
              
              ${additionalNotes ? `
                <div class="label">Additional Notes:</div>
                <div class="value" style="white-space: pre-wrap;">${additionalNotes}</div>
              ` : ''}
              
              ${howDidYouHear ? `
                <div class="label">How They Found Us:</div>
                <div class="value">${howDidYouHear}</div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Quick Actions -->
          <div class="section" style="background: #fff3cd; border-left-color: #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Quick Actions</h3>
            <p style="margin: 5px 0;">
              • <a href="mailto:${email}?subject=Re: Your Development Quote Request">Reply to ${fullName}</a><br>
              • <a href="tel:${phone}">Call ${phone}</a><br>
              • Priority: ${budget.includes('50k') || budget.includes('100k') ? '<strong style="color: red;">HIGH</strong>' : 'Normal'}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>This quote request was submitted through the Flickmax Development Services form.</p>
          <p>© ${new Date().getFullYear()} Flickmax. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}