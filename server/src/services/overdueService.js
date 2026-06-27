const cron = require('node-cron');
const db   = require('../config/db');
const { sendDueReminder, sendOverdueNotice } = require('./emailService');
const { calculateFine } = require('../utils/dateHelper');

const startOverdueCron = () => {
  // Every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] Running daily overdue check…');
    try {
      // Mark overdue
      const { rowCount } = await db.query(`
        UPDATE loans SET status='overdue'
        WHERE status='active' AND due_date < CURRENT_DATE
      `);
      console.log(`[CRON] Marked ${rowCount} loans as overdue`);

      // Send overdue emails
      const { rows: overdueLoans } = await db.query(`
        SELECT l.id, l.due_date, u.name, u.email, b.title,
               (CURRENT_DATE - l.due_date) AS days_overdue
        FROM loans l
        JOIN users u ON u.id = l.user_id
        JOIN books b ON b.id = l.book_id
        WHERE l.status = 'overdue'
      `);
      for (const loan of overdueLoans) {
        const fine = calculateFine(loan.due_date);
        try {
          await sendOverdueNotice(loan.email, loan.name, loan.title, loan.days_overdue, fine);
        } catch (e) {
          console.error(`[CRON] Email failed for ${loan.email}:`, e.message);
        }
      }

      // Send due-tomorrow reminders
      const { rows: dueSoon } = await db.query(`
        SELECT l.id, l.due_date, u.name, u.email, b.title
        FROM loans l
        JOIN users u ON u.id = l.user_id
        JOIN books b ON b.id = l.book_id
        WHERE l.status = 'active' AND l.due_date = CURRENT_DATE + 1
      `);
      for (const loan of dueSoon) {
        try {
          await sendDueReminder(loan.email, loan.name, loan.title, loan.due_date);
        } catch (e) {
          console.error(`[CRON] Reminder email failed for ${loan.email}:`, e.message);
        }
      }
      console.log(`[CRON] Sent ${dueSoon.length} due reminders, ${overdueLoans.length} overdue notices`);
    } catch (e) {
      console.error('[CRON] Error:', e.message);
    }
  });
};

module.exports = startOverdueCron;
