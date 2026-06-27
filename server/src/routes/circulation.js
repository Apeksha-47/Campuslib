const router = require('express').Router();
const ctrl   = require('../controllers/circulationController');
const auth   = require('../middleware/authMiddleware');
const role   = require('../middleware/roleMiddleware');

router.post('/checkout',  auth, role('admin','librarian'), ctrl.checkout);
router.post('/return',    auth, role('admin','librarian'), ctrl.returnBook);
router.post('/renew',     auth, role('admin','librarian'), ctrl.renew);
router.get('/active',     auth, role('admin','librarian'), ctrl.getActiveLoans);
router.get('/overdue',    auth, role('admin','librarian'), ctrl.getOverdue);
router.get('/my-loans',   auth, ctrl.myLoans);  // student self-service

module.exports = router;
