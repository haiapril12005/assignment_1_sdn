// controllers/questionController.js
const Question = require('../models/question');
const Quiz = require('../models/quiz');
const handleError = require('../utils/handleError');

/**
 * GET /questions (hoặc /question)
 * Lấy danh sách tất cả câu hỏi
 */
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * POST /questions (hoặc /question)
 * Tạo mới 1 câu hỏi độc lập
 */
exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * GET /questions/:questionId (hoặc /question/:questionId)
 * Lấy chi tiết câu hỏi theo ID
 */
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    res.status(200).json(question);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * PUT /questions/:questionId (hoặc /question/:questionId)
 * Cập nhật câu hỏi theo ID
 */
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(question);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * DELETE /questions/:questionId (hoặc /question/:questionId)
 * Xóa câu hỏi theo ID và tự động xóa ID câu hỏi khỏi mảng questions của mọi Quiz liên quan
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);

    if (question) {
      await Quiz.updateMany(
        { questions: question._id },
        { $pull: { questions: question._id } }
      );
    }

    res.status(200).json(question);
  } catch (err) {
    handleError(res, err);
  }
};
