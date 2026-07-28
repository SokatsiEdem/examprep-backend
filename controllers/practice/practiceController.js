const practiceService = require('../../services/practiceService');

/**
 * Controller endpoint: Start Practice Session (POST /practice/start)
 */
exports.startPractice = async (req, res, next) => {
  try {
    console.log(`[PracticeController] Incoming request: POST /practice/start from User ${req.user.id}`);
    
    const result = await practiceService.createPracticeSession(req.user.id, req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Practice session started successfully', 
      data: result 
    });
  } catch (error) {
    console.error(`[PracticeController Error] startPractice: ${error.message}`);
    next(error);
  }
};

/**
 * Controller endpoint: Submit Practice Session (POST /practice/:id/submit)
 */
exports.submitPractice = async (req, res, next) => {
  try {
    console.log(`[PracticeController] Incoming request: POST /practice/${req.params.id}/submit from User ${req.user.id}`);

    const summary = await practiceService.submitPracticeAnswers(req.user.id, req.params.id, req.body.answers);

    res.status(200).json({ 
      success: true, 
      message: 'Practice submitted successfully', 
      data: summary 
    });
  } catch (error) {
    console.error(`[PracticeController Error] submitPractice: ${error.message}`);
    next(error);
  }
};

/**
 * Controller endpoint: Fetch History (GET /practice/history)
 */
exports.getPracticeHistory = async (req, res, next) => {
  try {
    console.log(`[PracticeController] Incoming request: GET /practice/history from User ${req.user.id}`);

    const history = await practiceService.getUserPracticeHistory(req.user.id, req.query);

    res.status(200).json({ 
      success: true, 
      data: history 
    });
  } catch (error) {
    console.error(`[PracticeController Error] getPracticeHistory: ${error.message}`);
    next(error);
  }
};

/**
 * Controller endpoint: Fetch Session Details & Review (GET /practice/:id)
 */
exports.getPracticeById = async (req, res, next) => {
  try {
    console.log(`[PracticeController] Incoming request: GET /practice/${req.params.id} from User ${req.user.id}`);

    const details = await practiceService.getPracticeSessionDetails(req.user.id, req.params.id);

    res.status(200).json({ 
      success: true, 
      data: details 
    });
  } catch (error) {
    console.error(`[PracticeController Error] getPracticeById: ${error.message}`);
    next(error);
  }
};