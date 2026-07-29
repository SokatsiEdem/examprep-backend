// routes/subjectsRoute.js


import express from 'express';
const router = express.Router();


import * as subjectsController from '../controllers/subjectsController.js';


router.get('/', subjectsController.getAllSubjects);


export default router;
