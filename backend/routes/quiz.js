import express from 'express';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('AUTH ERROR:', err.message);
    return res.status(401).json({ success: false, message: 'Token invalid' });
  }
};

router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    const quizzes = await Quiz.find(filter).lean();
    res.json({ success: true, quizzes });
  } catch (err) {
    console.error('GET /quizzes error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/questions', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const filter = {};
    if (quiz.category !== 'Mixed') filter.category = quiz.category;
    if (quiz.difficulty !== 'mixed') filter.difficulty = quiz.difficulty;

    let questions = await Question.find(filter).lean();
    questions = questions.sort(() => Math.random() - 0.5).slice(0, quiz.totalQuestions);

    const questionsWithoutAnswer = questions.map(q => ({
      _id: q._id,
      questionId: q.questionId,
      question: q.question,
      options: q.options.sort(() => Math.random() - 0.5),
      difficulty: q.difficulty,
      category: q.category
    }));

    res.json({ success: true, questions: questionsWithoutAnswer, quiz });
  } catch (err) {
    console.error('GET /questions error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Answers array required' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questionIds = answers.map(a => Number(a.questionId));
    const questions = await Question.find({ questionId: { $in: questionIds } }).lean();

    let correctAnswers = 0;
    const detailedAnswers = answers.map(userAnswer => {
      const question = questions.find(q => q.questionId === Number(userAnswer.questionId));
      const isCorrect = !!(question && question.answer === userAnswer.userAnswer);
      if (isCorrect) correctAnswers++;
      return {
        questionId: Number(userAnswer.questionId),
        question: question?.question || '',
        userAnswer: userAnswer.userAnswer || '',
        correctAnswer: question?.answer || '',
        isCorrect
      };
    });

    const totalQ = answers.length;
    const wrong = totalQ - correctAnswers;
    const percentage = Math.round((correctAnswers / totalQ) * 100);
    const score = correctAnswers * 10;

    let grade;
    if (percentage >= 95) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 55) grade = 'C';
    else if (percentage >= 40) grade = 'D';
    else grade = 'F';

    const result = await Result.create({
      user: req.user._id,
      quiz: quiz._id,
      quizTitle: quiz.title,
      category: quiz.category,
      score,
      totalQuestions: totalQ,
      correctAnswers,
      wrongAnswers: wrong,
      percentage,
      timeTaken: timeTaken || 0,
      answers: detailedAnswers,
      grade
    });

    quiz.totalAttempts += 1;
    const allResults = await Result.find({ quiz: quiz._id });
    quiz.averageScore = Math.round(
      allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length
    );
    await quiz.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalQuizzesTaken: 1, totalScore: score }
    });

    res.json({ success: true, result });
  } catch (err) {
    console.error('SUBMIT ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;