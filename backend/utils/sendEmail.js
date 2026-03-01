import nodemailer from "nodemailer";

// Create a persistent transporter with connection pooling
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  pool: true,     // Use connection pooling for efficiency
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generic mail sending function to reduce redundancy
 * @param {string} fromLabel - Label for the sender name
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendMail = async (fromLabel, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"${fromLabel}" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error(`Email sending error (${fromLabel}):`, err);
    throw err;
  }
};

export const sendContactEmail = async ({ subject, html }) => {
  await sendMail("Contact Form", subject, html);
};

export const sendEmergencyEmail = async ({ subject, html }) => {
  await sendMail("Emergency Alert", subject, html);
};

export const sendEnquiryEmail = async ({ subject, html }) => {
  await sendMail("Enquiry Form", subject, html);
};
