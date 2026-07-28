const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practice/practiceController');
const { validateStartPractice, validateSubmitPractice } = require('../validators/practiceValidator');

// Provided by Member 1 (Auth Lead)
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', validateStartPractice, practiceController.startPractice);
router.post('/:id/submit', validateSubmitPractice, practiceController.submitPractice);
router.get('/history', practiceController.getPracticeHistory);
router.get('/:id', practiceController.getPracticeById);

module.exports = router;