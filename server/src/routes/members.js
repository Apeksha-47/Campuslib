const router = require('express').Router();
const ctrl   = require('../controllers/memberController');
const auth   = require('../middleware/authMiddleware');
const role   = require('../middleware/roleMiddleware');

router.get('/',       auth, role('admin','librarian'), ctrl.getAll);
router.get('/:id',    auth, role('admin','librarian'), ctrl.getOne);
router.post('/',      auth, role('admin','librarian'), ctrl.create);
router.put('/:id',    auth, role('admin','librarian'), ctrl.update);

module.exports = router;
