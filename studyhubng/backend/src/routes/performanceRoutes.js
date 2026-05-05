const express = require('express');
const router = express.Router();
const { recordAttempt, getDashboardStats } = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, recordAttempt);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
