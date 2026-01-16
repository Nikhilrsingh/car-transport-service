import nodemailer from "nodemailer";


export const sendContactEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};

export const sendEmergencyEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Emergency Alert" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};

export const sendEnquiryEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Enquiry Form" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};
