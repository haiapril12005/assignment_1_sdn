// routes/quizRouter.js - Express Router Node Module for Quizzes REST API
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// /quizzes
router
  .route('/')
  .get(quizController.getAllQuizzes)
  .post(quizController.createQuiz);

// /quizzes/:quizId
router
  .route('/:quizId')
  .get(quizController.getQuizById)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

// Yêu cầu 3: GET /quizzes/:quizId/populate (Lọc câu hỏi chứa từ 'capital')
router.get('/:quizId/populate', quizController.getCapitalQuestions);

// Yêu cầu 4: POST /quizzes/:quizId/question (Thêm 1 câu hỏi vào quiz)
router.post('/:quizId/question', quizController.addQuestionToQuiz);

// Yêu cầu 5: POST /quizzes/:quizId/questions (Thêm nhiều câu hỏi vào quiz)
router.post('/:quizId/questions', quizController.addManyQuestionsToQuiz);

module.exports = router;
