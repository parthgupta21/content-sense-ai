const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { authenticationKey } = require('../../middleware/authMiddleware');
const { rateLimiter } = require('../../middleware/rateLimiter');
const { validateRequest } = require('../../middleware/validation');

router.post('/analyze', validateRequest, authenticationKey, rateLimiter, analysisController.analyzeContent);

module.exports = router;