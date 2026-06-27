module.exports = {
  PORT:              process.env.PORT || 5000,
  DATABASE_URL:      process.env.DATABASE_URL,
  JWT_SECRET:        process.env.JWT_SECRET,
  JWT_EXPIRES_IN:    process.env.JWT_EXPIRES_IN || '7d',
  FINE_PER_DAY:      Number(process.env.FINE_PER_DAY) || 2,
  LOAN_DAYS:         Number(process.env.LOAN_DURATION_DAYS) || 14,
  GRACE_DAYS:        Number(process.env.GRACE_PERIOD_DAYS) || 2,
};
