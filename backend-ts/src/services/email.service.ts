// Email service using Nodemailer

import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

let transporter: nodemailer.Transporter | null = null;

// Initialize transporter if config is available
if (config.email.host && config.email.user && config.email.pass) {
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port || 587,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!transporter) {
    logger.warn('Email service not configured, skipping email');
    return false;
  }

  try {
    await transporter.sendMail({
      from: config.email.from || 'Holy Travels <noreply@holytravels.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    
    logger.info({ to: options.to, subject: options.subject }, 'Email sent');
    return true;
  } catch (error) {
    logger.error({ error, to: options.to }, 'Failed to send email');
    return false;
  }
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmationEmail = async (
  to: string,
  data: {
    name: string;
    tourTitle: string;
    startDate: Date;
    endDate: Date;
    numberOfTravellers: number;
    totalAmount: string;
    bookingId: string;
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🙏 Booking Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          <p>Thank you for booking with Holy Travels! Your spiritual journey awaits.</p>
          
          <div class="details">
            <h3>${data.tourTitle}</h3>
            <div class="detail-row">
              <span>Booking ID:</span>
              <strong>${data.bookingId}</strong>
            </div>
            <div class="detail-row">
              <span>Start Date:</span>
              <strong>${data.startDate.toLocaleDateString('en-IN')}</strong>
            </div>
            <div class="detail-row">
              <span>End Date:</span>
              <strong>${data.endDate.toLocaleDateString('en-IN')}</strong>
            </div>
            <div class="detail-row">
              <span>Travellers:</span>
              <strong>${data.numberOfTravellers}</strong>
            </div>
            <div class="detail-row">
              <span>Total Amount:</span>
              <strong>₹${data.totalAmount}</strong>
            </div>
          </div>
          
          <p>We'll send you detailed itinerary and updates closer to your departure date.</p>
          <p>If you have any questions, feel free to contact us.</p>
          
          <p>May your journey be blessed! 🙏</p>
        </div>
        <div class="footer">
          <p>Holy Travels - Spiritual Journeys That Transform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Booking Confirmed - ${data.tourTitle}`,
    html,
    text: `Booking Confirmed!\n\nDear ${data.name},\n\nYour booking for ${data.tourTitle} has been confirmed.\n\nBooking ID: ${data.bookingId}\nStart Date: ${data.startDate.toLocaleDateString()}\nTravellers: ${data.numberOfTravellers}\nTotal: ₹${data.totalAmount}\n\nThank you for choosing Holy Travels!`,
  });
};

/**
 * Send emergency alert email
 */
export const sendEmergencyAlertEmail = async (
  to: string,
  data: {
    name: string;
    tourTitle: string;
    alertTitle: string;
    alertMessage: string;
    severity: string;
  }
) => {
  const severityColors: Record<string, string> = {
    low: '#17a2b8',
    medium: '#ffc107',
    high: '#fd7e14',
    critical: '#dc3545',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${severityColors[data.severity] || '#dc3545'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${severityColors[data.severity] || '#dc3545'}; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 ${data.alertTitle}</h1>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          <p>This is an urgent notification regarding your tour: <strong>${data.tourTitle}</strong></p>
          
          <div class="alert-box">
            <p>${data.alertMessage}</p>
          </div>
          
          <p>Please check the app for more details and follow any instructions from your tour guide.</p>
          <p>Stay safe!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `🚨 URGENT: ${data.alertTitle} - ${data.tourTitle}`,
    html,
    text: `URGENT ALERT\n\n${data.alertTitle}\n\nDear ${data.name},\n\n${data.alertMessage}\n\nPlease check the app for more details.\n\nTour: ${data.tourTitle}`,
  });
};

