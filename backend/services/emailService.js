const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmed - ${booking.bookingId} | Holy Travels`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FF6B35, #F7C59F); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
          .content { padding: 30px; }
          .booking-id { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .booking-id span { font-size: 24px; font-weight: bold; color: #FF6B35; }
          .details { margin: 20px 0; }
          .details h3 { color: #333; border-bottom: 2px solid #FF6B35; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { color: #666; }
          .detail-value { color: #333; font-weight: 500; }
          .amount { background: #FFF5F0; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .amount .total { font-size: 24px; color: #FF6B35; font-weight: bold; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; }
          .footer a { color: #FF6B35; text-decoration: none; }
          .cta-btn { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Booking Confirmed!</h1>
            <p>Your sacred journey awaits</p>
          </div>
          <div class="content">
            <div class="booking-id">
              <p style="margin: 0; color: #666;">Booking ID</p>
              <span>${booking.bookingId}</span>
            </div>
            
            <div class="details">
              <h3>📍 Tour Details</h3>
              <div class="detail-row">
                <span class="detail-label">Tour</span>
                <span class="detail-value">${booking.tour?.title?.en || 'Tour'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${booking.tour?.duration?.days || 'N/A'} Days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Travel Date</span>
                <span class="detail-value">${new Date(booking.tourDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passengers</span>
                <span class="detail-value">${booking.totalPassengers} Person(s)</span>
              </div>
            </div>

            <div class="details">
              <h3>👤 Traveller Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">${booking.user?.name || 'Guest'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">${booking.user?.email || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${booking.user?.phone || 'N/A'}</span>
              </div>
            </div>

            <div class="amount">
              <p style="margin: 0 0 10px; color: #666;">Total Amount</p>
              <span class="total">₹${booking.totalAmount?.toLocaleString('en-IN') || '0'}</span>
              <p style="margin: 10px 0 0; color: #28a745; font-size: 14px;">✓ Payment Received</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/my-bookings" class="cta-btn">View Booking Details</a>
            </div>

            <div style="background: #FFF9E6; padding: 15px; border-radius: 8px; border-left: 4px solid #FFC107; margin-top: 20px;">
              <p style="margin: 0; color: #856404;">
                <strong>📞 Need Help?</strong><br>
                Contact us at <a href="tel:+919876543210" style="color: #FF6B35;">+91 98765 43210</a> or 
                <a href="mailto:support@holytravels.com" style="color: #FF6B35;">support@holytravels.com</a>
              </p>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing <strong>Holy Travels</strong></p>
            <p>Spiritual & Historic Journeys Across India</p>
            <p><a href="${process.env.FRONTEND_URL}">www.holytravels.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  otpEmail: (otp, name) => ({
    subject: 'Your OTP for Holy Travels',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; }
          .otp-box { background: #FF6B35; color: white; font-size: 32px; letter-spacing: 8px; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${name || 'Traveller'}!</h2>
          <p>Your verification code is:</p>
          <div class="otp-box">${otp}</div>
          <p>This code is valid for <strong>5 minutes</strong>.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Holy Travels - Spiritual & Historic Journeys</p>
        </div>
      </body>
      </html>
    `
  }),

  welcomeEmail: (user) => ({
    subject: 'Welcome to Holy Travels! 🙏',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #FF6B35, #F7C59F); padding: 40px; text-align: center; color: white; }
          .content { padding: 30px; }
          .feature { display: flex; align-items: center; margin: 15px 0; }
          .feature-icon { font-size: 24px; margin-right: 15px; }
          .cta-btn { display: inline-block; background: #FF6B35; color: white; padding: 15px 40px; border-radius: 25px; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Holy Travels!</h1>
            <p>Begin your spiritual journey with us</p>
          </div>
          <div class="content">
            <h2>Namaste ${user.name}! 🙏</h2>
            <p>Thank you for joining Holy Travels. We're excited to help you explore India's most sacred and historic destinations.</p>
            
            <h3>What you can do:</h3>
            <div class="feature">
              <span class="feature-icon">🛕</span>
              <span>Explore sacred pilgrimage tours</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🏰</span>
              <span>Discover historic monuments</span>
            </div>
            <div class="feature">
              <span class="feature-icon">❤️</span>
              <span>Save your favorite tours</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📱</span>
              <span>Get real-time updates</span>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/tours" class="cta-btn">Explore Tours</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  newsletterWelcome: (email) => ({
    subject: 'Welcome to Holy Travels Newsletter! 📬',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Thank you for subscribing! 🎉</h2>
          <p>You'll now receive:</p>
          <ul>
            <li>Exclusive tour deals and discounts</li>
            <li>New destination announcements</li>
            <li>Travel tips and guides</li>
            <li>Festival season specials</li>
          </ul>
          <p style="color: #666; font-size: 14px;">
            Don't want these emails? 
            <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}">Unsubscribe here</a>
          </p>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data);

    const mailOptions = {
      from: `"Holy Travels" <${process.env.SMTP_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendBookingConfirmation = async (booking) => {
  const userEmail = booking.user?.email;
  if (!userEmail) return { success: false, error: 'No email address' };
  return sendEmail(userEmail, 'bookingConfirmation', booking);
};

const sendOTPEmail = async (email, otp, name) => {
  return sendEmail(email, 'otpEmail', { otp, name });
};

const sendWelcomeEmail = async (user) => {
  return sendEmail(user.email, 'welcomeEmail', user);
};

const sendNewsletterWelcome = async (email) => {
  return sendEmail(email, 'newsletterWelcome', email);
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendOTPEmail,
  sendWelcomeEmail,
  sendNewsletterWelcome
};

