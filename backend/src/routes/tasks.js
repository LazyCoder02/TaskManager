const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

router.use(auth); // Protect all task routes

router.get('/', taskController.getTasks);

router.post('/',
  [
    body('title').trim().notEmpty(),
    body('due_date').optional().isISO8601(),
    validate
  ],
  taskController.createTask
);

router.put('/:id',
  [
    body('title').trim().notEmpty(),
    body('due_date').optional().isISO8601(),
    body('status').isIn(['pending', 'in_progress', 'completed']),
    validate
  ],
  taskController.updateTask
);

router.delete('/:id', taskController.deleteTask);

module.exports = router;