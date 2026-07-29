// routes/usersRoute.js


import express from 'express';
const router = express.Router();


import * as usersController from '../controllers/usersController.js';
import * as subjectsController from '../controllers/subjectsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { updateProfileValidator, subjectValidator } from '../validators/usersValidator.js';


// For Profile
router.get('/profile', protect, usersController.getProfile);
router.put('/profile', protect, updateProfileValidator, validate, usersController.updateProfile);

// For Subjects
router.post('/subjects', protect, subjectValidator, validate, subjectsController.saveUserSubjects);
router.put('/subjects', protect, subjectValidator, validate, subjectsController.updateUserSubjects);


export default router;
