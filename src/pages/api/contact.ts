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
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.PUBLIC_EMAIL_USER,
        pass: import.meta.env.PUBLIC_EMAIL_APP_PASSWORD
      }
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Inquiry from BagelEdu</h2>
        
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;"><strong style="color: #34495e;">Name:</strong> ${formData.get('name')}</p>
          <p style="margin: 10px 0;"><strong style="color: #34495e;">Email:</strong> ${formData.get('email')}</p>
          <p style="margin: 10px 0;"><strong style="color: #34495e;">Phone:</strong> ${formData.get('phone')}</p>
          <p style="margin: 10px 0;"><strong style="color: #34495e;">Service Type:</strong> ${formData.get('grade')}</p>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${formData.get('message')}</p>
        </div>

        <div style="color: #7f8c8d; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>This is an automated message from BagelEdu Contact Form.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: import.meta.env.PUBLIC_EMAIL_USER,
      to: 'bageledu@gmail.com',
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
    console.error('Server error:', error);  // Debug line
    return new Response(JSON.stringify({
      message: 'Failed to send message. Please try again later.'
    }), { status: 500 });
  }
}