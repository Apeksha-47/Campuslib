const { LOAN_DAYS, GRACE_DAYS, FINE_PER_DAY } = require('../config/env');

exports.getDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + LOAN_DAYS);
  return d;
};

exports.calculateFine = (dueDate) => {
  const today = new Date();
  const due   = new Date(dueDate);
  const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  const overdueDays = diffDays - GRACE_DAYS;
  return overdueDays > 0 ? overdueDays * FINE_PER_DAY : 0;
};
