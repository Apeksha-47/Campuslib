const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

exports.sendDueReminder = async (to, name, bookTitle, dueDate) => {
  await transporter.sendMail({
    from: `"Bibliotheca Library" <${process.env.SMTP_USER}>`,
    to,
    subject: `Reminder: "${bookTitle}" is due soon`,
    html: `
      <p>Hi ${name},</p>
      <p>This is a reminder that <strong>${bookTitle}</strong> is due on <strong>${new Date(dueDate).toLocaleDateString('en-IN')}</strong>.</p>
      <p>Please return it on time to avoid fines (₹2/day after 2-day grace period).</p>
      <p>— Bibliotheca Library System</p>
    `,
  });
};

exports.sendOverdueNotice = async (to, name, bookTitle, daysOverdue, fineAmount) => {
  await transporter.sendMail({
    from: `"Bibliotheca Library" <${process.env.SMTP_USER}>`,
    to,
    subject: `Overdue Notice: "${bookTitle}"`,
    html: `
      <p>Hi ${name},</p>
      <p><strong>${bookTitle}</strong> is <strong>${daysOverdue} days overdue</strong>.</p>
      <p>Current fine: <strong>₹${fineAmount}</strong>. Please return it immediately.</p>
      <p>— Bibliotheca Library System</p>
    `,
  });
};
