// controllers/quizController.js
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const handleError = require('../utils/handleError');

/**
 * GET /quizzes
 * Lấy toàn bộ danh sách Quiz và dùng populate('questions') để hiển thị đầy đủ chi tiết câu hỏi
 */
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.status(200).json(quizzes);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * POST /quizzes
 * Tạo 1 hoặc nhiều quiz mới
 * Trả về message theo định dạng chuẩn của bài tập
 */
exports.createQuiz = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const quizzes = await Quiz.create(req.body);
      const ids = quizzes.map((q) => q._id);
      return res.status(200).send(`Added ${quizzes.length} quizzes with ids: ${ids.join(', ')}`);
    }
    const quiz = await Quiz.create(req.body);
    res.status(200).send(`Added the quiz with id: ${quiz._id}`);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * GET /quizzes/:quizId
 * Lấy chi tiết quiz theo quizId, populate câu hỏi
 */
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    res.status(200).json(quiz);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * PUT /quizzes/:quizId
 * Cập nhật thông tin quiz
 */
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
      new: true,
      runValidators: true
    }).populate('questions');
    res.status(200).json(quiz);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * DELETE /quizzes/:quizId
 * Xóa quiz theo quizId
 */
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    res.status(200).json(quiz);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * GET /quizzes/:quizId/populate
 * Yêu cầu 3: Lọc câu hỏi trong quiz có chứa từ 'capital' (trong text hoặc keywords)
 */
exports.getCapitalQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: 'questions',
      match: {
        $or: [{ text: /capital/i }, { keywords: /capital/i }]
      }
    });
    res.status(200).json(quiz);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * POST /quizzes/:quizId/question
 * Yêu cầu 4: Tạo 1 câu hỏi mới và thêm vào quiz
 */
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const question = await Question.create(req.body);
    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json(question);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * POST /quizzes/:quizId/questions
 * Yêu cầu 5: Tạo nhiều câu hỏi mới cùng lúc và thêm vào quiz
 */
exports.addManyQuestionsToQuiz = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res
        .status(400)
        .json({ message: 'Request body must be a non-empty array of questions' });
    }

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questions = await Question.insertMany(req.body);
    quiz.questions.push(...questions.map((q) => q._id));
    await quiz.save();

    res.status(200).json({ message: 'Questions added successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};
