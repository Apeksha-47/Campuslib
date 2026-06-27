require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config/env');
const startOverdueCron = require('./services/overdueService');

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  startOverdueCron();
  console.log('📅 Overdue cron job started');
});
