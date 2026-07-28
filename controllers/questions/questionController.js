const questionService = require('../../services/questionService');

exports.getQuestions = async (req, res, next) => {
  try {
    const data = await questionService.fetchQuestions(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.searchQuestions = async (req, res, next) => {
  try {
    const results = await questionService.searchQuestions(req.query.q);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};