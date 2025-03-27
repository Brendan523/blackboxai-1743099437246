const express = require('express');
const router = express.Router();
const logger = require('../logger');

// Import controllers (to be created)
const { processChat, getHistory } = require('../controllers/chatController');

// Middleware to verify request has required fields
const validateChatRequest = (req, res, next) => {
    if (!req.body.message) {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Message is required'
        });
    }
    next();
};

// Process incoming chat messages
router.post('/message', validateChatRequest, async (req, res) => {
    try {
        const response = await processChat(req.body.message);
        res.json(response);
    } catch (error) {
        logger.error('Error processing chat message:', error);
        res.status(500).json({
            error: 'Chat processing failed',
            message: 'Failed to process your message'
        });
    }
});

// Get chat history
router.get('/history', async (req, res) => {
    try {
        const history = await getHistory(req.query.limit || 50);
        res.json(history);
    } catch (error) {
        logger.error('Error fetching chat history:', error);
        res.status(500).json({
            error: 'History fetch failed',
            message: 'Failed to retrieve chat history'
        });
    }
});

module.exports = router;