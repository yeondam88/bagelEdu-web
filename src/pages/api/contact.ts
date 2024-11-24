import type { APIRoute } from 'astro'
import nodemailer from 'nodemailer'

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'This endpoint only accepts POST requests'
  }), { 
    status: 405,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    console.log('Received form data:', Object.fromEntries(formData));

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.PUBLIC_EMAIL_USER,
        pass: import.meta.env.PUBLIC_EMAIL_APP_PASSWORD
      }
    });

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc;">
          <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          ">
            <div style="
              background: white;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            ">
              <div style="text-align: center; margin-bottom: 24px;">
                <img 
                  src="https://bageledu.sfo3.cdn.digitaloceanspaces.com/bageledu-logo-v1.png" 
                  alt="BagelEdu Logo" 
                  style="
                    width: 180px;
                    height: auto;
                    margin: 0 auto;
                  "
                />
              </div>
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="
                  color: #1a1a1a;
                  font-size: 24px;
                  font-weight: 600;
                  margin: 0;
                ">New Inquiry from BagelEdu</h1>
              </div>

              <div style="margin: 24px 0; border-top: 1px solid #e1e1e1; padding-top: 24px;">
                <div style="margin-bottom: 16px;">
                  <p style="
                    margin: 0 0 8px;
                    color: #666;
                    font-size: 14px;
                    font-weight: 500;
                  ">Name</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${formData.get('name')}</p>
                </div>
                
                <div style="margin-bottom: 16px;">
                  <p style="
                    margin: 0 0 8px;
                    color: #666;
                    font-size: 14px;
                    font-weight: 500;
                  ">Email</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${formData.get('email')}</p>
                </div>

                <div style="margin-bottom: 16px;">
                  <p style="
                    margin: 0 0 8px;
                    color: #666;
                    font-size: 14px;
                    font-weight: 500;
                  ">Phone</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${formData.get('phone')}</p>
                </div>

                <div style="margin-bottom: 16px;">
                  <p style="
                    margin: 0 0 8px;
                    color: #666;
                    font-size: 14px;
                    font-weight: 500;
                  ">Service Type</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${formData.get('grade')}</p>
                </div>
              </div>

              <div style="
                background: #f8fafc;
                border-radius: 8px;
                padding: 24px;
                margin: 24px 0;
              ">
                <p style="
                  margin: 0 0 8px;
                  color: #666;
                  font-size: 14px;
                  font-weight: 500;
                ">Message</p>
                <p style="
                  margin: 0;
                  color: #1a1a1a;
                  font-size: 16px;
                  white-space: pre-wrap;
                  line-height: 1.5;
                ">${formData.get('message')}</p>
              </div>

              <div style="
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #e1e1e1;
                text-align: center;
              ">
                <p style="
                  margin: 0;
                  color: #666;
                  font-size: 13px;
                ">This is an automated message from BagelEdu Contact Form</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: import.meta.env.PUBLIC_EMAIL_USER,
      to: import.meta.env.EMAIL_TO_ACCOUNT,
      subject: `New Inquiry from ${formData.get('name')}`,
      html: htmlTemplate,
      // Keep text version as fallback
      text: `
        Name: ${formData.get('name')}
        Email: ${formData.get('email')}
        Phone: ${formData.get('phone')}
        Service Type: ${formData.get('grade')}
        Message: ${formData.get('message')}
      `
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({
      message: 'Message sent successfully!'
    }), { status: 200 });

  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(JSON.stringify({
      message: 'Error processing form submission',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}