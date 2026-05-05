const express = require('express');
const router = express.Router();
const { getQuestions, createQuestion, updateQuestion, deleteQuestion, bulkCreateQuestions } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getQuestions)
  .post(protect, createQuestion);

router.route('/bulk')
  .post(protect, bulkCreateQuestions);

router.route('/:id')
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

module.exports = router;
