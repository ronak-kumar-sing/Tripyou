const transporter = require('../config/email');
const { formatDate, formatPrice } = require('./helpers');

// Send booking confirmation email
exports.sendBookingConfirmation = async (booking, tour) => {
  const mailOptions = {
    from: `"TourHub" <${process.env.SMTP_FROM}>`,
    to: booking.customer_email,
    subject: `Booking Confirmation - ${booking.booking_reference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #32B8C6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #32B8C6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.customer_name},</p>
            <p>Thank you for booking with TourHub! Your booking has been received and is being processed.</p>

            <div class="details">
              <h3>Booking Details</h3>
              <p><strong>Reference:</strong> <span class="highlight">${booking.booking_reference}</span></p>
              <p><strong>Tour:</strong> ${tour.title}</p>
              <p><strong>Date:</strong> ${formatDate(booking.booking_date)}</p>
              <p><strong>Participants:</strong> ${booking.number_of_people} Adults${booking.number_of_children ? `, ${booking.number_of_children} Children` : ''}</p>
              <p><strong>Total Price:</strong> <span class="highlight">${formatPrice(booking.total_price)}</span></p>
              <p><strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
            </div>

            ${booking.special_requests ? `
              <div class="details">
                <h3>Special Requests</h3>
                <p>${booking.special_requests}</p>
              </div>
            ` : ''}

            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The TourHub Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TourHub. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Send contact reply email
exports.sendContactReply = async (contact, reply) => {
  const mailOptions = {
    from: `"TourHub Support" <${process.env.SMTP_FROM}>`,
    to: contact.email,
    subject: `Re: ${contact.subject || 'Your inquiry'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #32B8C6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .original { background: #e9e9e9; padding: 15px; margin: 15px 0; border-left: 4px solid #32B8C6; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TourHub Support</h1>
          </div>
          <div class="content">
            <p>Dear ${contact.name},</p>

            ${reply}

            <div class="original">
              <p><strong>Your original message:</strong></p>
              <p>${contact.message}</p>
            </div>

            <p>Best regards,<br>The TourHub Support Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TourHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Send newsletter welcome email
exports.sendNewsletterWelcome = async (email) => {
  const mailOptions = {
    from: `"TourHub" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Welcome to TourHub Newsletter!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #32B8C6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .cta { display: inline-block; background: #32B8C6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TourHub!</h1>
          </div>
          <div class="content">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll now receive exclusive offers, travel tips, and updates about our amazing tours and experiences.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/tours" class="cta">Explore Tours</a>
            </p>
            <p>Best regards,<br>The TourHub Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TourHub. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Send booking confirmation approved email
exports.sendBookingApprovedEmail = async (booking, tour) => {
  const mailOptions = {
    from: `"TourHub" <${process.env.SMTP_FROM}>`,
    to: booking.customer_email,
    subject: `Booking Confirmed - ${booking.booking_reference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #10B981; font-weight: bold; }
          .badge { display: inline-block; background: #10B981; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.customer_name},</p>
            <p>Excellent news! Your booking has been confirmed and approved. We're excited to welcome you!</p>

            <div class="badge">Status: CONFIRMED</div>

            <div class="details">
              <h3>Booking Details</h3>
              <p><strong>Reference:</strong> <span class="highlight">${booking.booking_reference}</span></p>
              <p><strong>Tour:</strong> ${tour.title}</p>
              <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
              <p><strong>Participants:</strong> ${booking.number_of_people} Adults${booking.number_of_children ? `, ${booking.number_of_children} Children` : ''}</p>
              <p><strong>Total Price:</strong> <span class="highlight">$${booking.total_price}</span></p>
            </div>

            <div class="details">
              <h3>What's Next?</h3>
              <ul>
                <li>Check your email for further instructions and itinerary details</li>
                <li>Keep your booking reference safe for check-in: <span class="highlight">${booking.booking_reference}</span></li>
                <li>Arrive 15 minutes early on the tour date</li>
                <li>Contact us if you have any questions</li>
              </ul>
            </div>

            ${booking.special_requests ? `
              <div class="details">
                <h3>Your Special Requests</h3>
                <p>${booking.special_requests}</p>
              </div>
            ` : ''}

            <p>Thank you for choosing TourHub. We look forward to providing you an unforgettable experience!</p>
            <p>Best regards,<br>The TourHub Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TourHub. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};
