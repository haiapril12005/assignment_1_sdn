// routes/questionRouter.js - Express Router Node Module for Questions REST API
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// /questions hoặc /question
router
  .route('/')
  .get(questionController.getAllQuestions)
  .post(questionController.createQuestion);

// /questions/:questionId hoặc /question/:questionId
router
  .route('/:questionId')
  .get(questionController.getQuestionById)
  .put(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
