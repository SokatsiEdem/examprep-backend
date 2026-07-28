const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions/questionController');
const { validateQuestionQuery, validateSearchQuery } = require('../validators/practiceValidator');

router.get('/', validateQuestionQuery, questionController.getQuestions);
router.get('/search', validateSearchQuery, questionController.searchQuestions);
router.get('/:id', questionController.getQuestionById);

module.exports = router;