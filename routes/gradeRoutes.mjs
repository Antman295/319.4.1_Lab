// Imports
import express from 'express';
import gradesCTL from '../controllers/gradesController.mjs'

const router = express.Router()

// Get stats of class
router.get('/stats', gradesCTL.getClassStatus);

// Get stat of learner within a class
router.get('/stats/:id', gradesCTL.getSpecificClassStatus);

// Get grades by ID here
router.get('/:id', gradesCTL.getSingleGrade);

// Get student by ID
router.get('/student/:id', gradesCTL.getStudentGrades)

// Get class by ID
router.get('/class/:id', gradesCTL.getClassGrades)

// Add new grade to DB
router.post('/', gradesCTL.createGrade)

// Get weighted average for learner across all classes
router.get('/student/:id/avg', gradesCTL.studentClassesAverage)

export default router;