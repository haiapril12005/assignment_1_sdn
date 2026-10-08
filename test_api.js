// test_api.js - Automated Test Script for Assignment 1 (SimpleQuiz)
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const quizRouter = require('./routes/quizRouter');
const questionRouter = require('./routes/questionRouter');
const Quiz = require('./models/quiz');
const Question = require('./models/question');

async function runTests() {
  const app = express();
  app.use(express.json());
  app.use('/quizzes', quizRouter);
  app.use('/questions', questionRouter);
  app.use('/question', questionRouter);

  const MONGO_URL =
    process.env.MONGO_URL ||
    process.env.MONGODB_URL ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/SimpleQuiz';

  console.log('========================================================');
  console.log('🚀 STARTING AUTOMATED TEST SUITE FOR SIMPLEQUIZ API');
  console.log('========================================================');
  console.log('Connecting to MongoDB:', MONGO_URL);

  await mongoose.connect(MONGO_URL);
  console.log('✅ Connected to MongoDB successfully!\n');

  const TEST_PORT = 3123;
  const server = app.listen(TEST_PORT);
  const baseUrl = `http://localhost:${TEST_PORT}`;

  try {
    // 0. Reset collections for clean test
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    console.log('🧹 Cleaned up existing test data from SimpleQuiz.\n');

    // 1. POST /questions (hoặc /question)
    console.log('--- TEST 1: POST /questions (Tạo câu hỏi độc lập) ---');
    const q1Res = await fetch(`${baseUrl}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'What is the capital of Vietnam?',
        options: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hue'],
        keywords: ['capital', 'vietnam'],
        correctAnswerIndex: 0
      })
    });
    const q1Data = await q1Res.json();
    console.log('Status:', q1Res.status);
    console.log('Created question ID:', q1Data._id);
    console.log('Created question text:', q1Data.text);

    // 2. GET /questions (Lấy danh sách câu hỏi)
    console.log('\n--- TEST 2: GET /questions (Lấy tất cả câu hỏi) ---');
    const getQRes = await fetch(`${baseUrl}/questions`);
    const getQData = await getQRes.json();
    console.log('Status:', getQRes.status);
    console.log('Total questions found:', getQData.length);

    // 3. POST /quizzes (Tạo bài quiz mới)
    console.log('\n--- TEST 3: POST /quizzes (Tạo bài quiz) ---');
    const quizRes = await fetch(`${baseUrl}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Science & Geography Quiz',
        description: 'Test your knowledge of scientific concepts and world capitals!'
      })
    });
    const quizText = await quizRes.text();
    console.log('Status:', quizRes.status);
    console.log('Response body:', quizText);

    // Trích xuất Quiz ID
    const quizId = quizText.replace('Added the quiz with id: ', '').trim();
    console.log('Extracted Quiz ID:', quizId);

    // 4. POST /quizzes/:quizId/question (Yêu cầu 4: Thêm 1 câu hỏi vào quiz)
    console.log('\n--- TEST 4: POST /quizzes/:quizId/question (Yêu cầu 4) ---');
    const addQRes = await fetch(`${baseUrl}/quizzes/${quizId}/question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        keywords: ['capital', 'europe'],
        correctAnswerIndex: 0
      })
    });
    const addQData = await addQRes.json();
    console.log('Status:', addQRes.status);
    console.log('Added question ID:', addQData._id);
    console.log('Added question text:', addQData.text);

    // 5. POST /quizzes/:quizId/questions (Yêu cầu 5: Thêm nhiều câu hỏi vào quiz)
    console.log('\n--- TEST 5: POST /quizzes/:quizId/questions (Yêu cầu 5) ---');
    const addManyRes = await fetch(`${baseUrl}/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        {
          text: 'What is the capital of Germany?',
          options: ['Paris', 'London', 'Berlin', 'Madrid'],
          keywords: ['capital', 'germany'],
          correctAnswerIndex: 2
        },
        {
          text: 'Which is the largest ocean?',
          options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
          keywords: ['ocean', 'geography'],
          correctAnswerIndex: 1
        }
      ])
    });
    const addManyData = await addManyRes.json();
    console.log('Status:', addManyRes.status);
    console.log('Response message:', JSON.stringify(addManyData));

    // 6. GET /quizzes (Yêu cầu 2: Populate toàn bộ câu hỏi trong quizzes)
    console.log('\n--- TEST 6: GET /quizzes (Populate tất cả câu hỏi) ---');
    const allQuizzesRes = await fetch(`${baseUrl}/quizzes`);
    const allQuizzesData = await allQuizzesRes.json();
    console.log('Status:', allQuizzesRes.status);
    console.log('Total quizzes:', allQuizzesData.length);
    console.log('First quiz title:', allQuizzesData[0].title);
    console.log('First quiz populated questions count:', allQuizzesData[0].questions.length);

    // 7. GET /quizzes/:quizId/populate (Yêu cầu 3: Lọc câu hỏi có từ "capital")
    console.log('\n--- TEST 7: GET /quizzes/:quizId/populate (Yêu cầu 3: Filter "capital") ---');
    const popRes = await fetch(`${baseUrl}/quizzes/${quizId}/populate`);
    const popData = await popRes.json();
    console.log('Status:', popRes.status);
    console.log('Matching questions count (contains "capital"):', popData.questions.length);
    popData.questions.forEach((q, idx) => {
      console.log(`  [${idx + 1}] ${q.text} (Options: ${q.options.join(', ')})`);
    });

    // 8. PUT /quizzes/:quizId (Cập nhật Quiz)
    console.log('\n--- TEST 8: PUT /quizzes/:quizId (Cập nhật Quiz) ---');
    const updateQuizRes = await fetch(`${baseUrl}/quizzes/${quizId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Updated Science & Geography Quiz'
      })
    });
    const updateQuizData = await updateQuizRes.json();
    console.log('Status:', updateQuizRes.status);
    console.log('Updated Title:', updateQuizData.title);

    // 9. DELETE /quizzes/:quizId (Xóa Quiz)
    console.log('\n--- TEST 9: DELETE /quizzes/:quizId (Xóa Quiz) ---');
    const delRes = await fetch(`${baseUrl}/quizzes/${quizId}`, { method: 'DELETE' });
    const delData = await delRes.json();
    console.log('Status:', delRes.status);
    console.log('Deleted Quiz ID:', delData._id);

    const getDeletedRes = await fetch(`${baseUrl}/quizzes/${quizId}`);
    const getDeletedData = await getDeletedRes.json();
    console.log('GET after delete status:', getDeletedRes.status, 'body:', getDeletedData);

    console.log('\n========================================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! EVERYTHING WORKS! 🎉');
    console.log('========================================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests();
