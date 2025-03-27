const express = require('express');
const router = express.Router();
const logger = require('../logger');
const { 
    processPayment, 
    getTransactionHistory, 
    getNetProfit 
} = require('../controllers/paymentController');

// Middleware to validate payment requests
const validatePaymentRequest = (req, res, next) => {
    const { amount, currency } = req.body;
    
    if (!amount || !currency) {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Amount and currency are required'
        });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            error: 'Invalid amount',
            message: 'Amount must be a positive number'
        });
    }

    next();
};

// Process payment
router.post('/process', validatePaymentRequest, async (req, res) => {
    try {
        const transaction = await processPayment(req.body);
        res.json({
            status: 'success',
            data: transaction
        });
    } catch (error) {
        logger.error('Payment processing error:', error);
        res.status(500).json({
            error: 'Payment processing failed',
            message: error.message || 'Failed to process payment'
        });
    }
});

// Get transaction history with optional filters
router.get('/history', async (req, res) => {
    try {
        const filters = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            status: req.query.status
        };

        const history = await getTransactionHistory(filters);
        res.json({
            status: 'success',
            data: history
        });
    } catch (error) {
        logger.error('Error fetching transaction history:', error);
        res.status(500).json({
            error: 'History fetch failed',
            message: error.message || 'Failed to fetch transaction history'
        });
    }
});

// Get net profit calculations
router.get('/profit/:timeframe?', async (req, res) => {
    try {
        const timeframe = req.params.timeframe || 'all';
        const validTimeframes = ['day', 'week', 'month', 'year', 'all'];

        if (!validTimeframes.includes(timeframe)) {
            return res.status(400).json({
                error: 'Invalid timeframe',
                message: 'Timeframe must be one of: ' + validTimeframes.join(', ')
            });
        }

        const profitMetrics = await getNetProfit(timeframe);
        res.json({
            status: 'success',
            data: profitMetrics
        });
    } catch (error) {
        logger.error('Error calculating net profit:', error);
        res.status(500).json({
            error: 'Profit calculation failed',
            message: error.message || 'Failed to calculate net profit'
        });
    }
});

// Webhook endpoint for payment gateway callbacks
router.post('/webhook', async (req, res) => {
    try {
        logger.info('Received payment webhook', { 
            event: req.body.type,
            timestamp: new Date().toISOString()
        });

        // TODO: Implement webhook handling logic
        // This is a placeholder implementation
        res.json({ received: true });
    } catch (error) {
        logger.error('Webhook processing error:', error);
        res.status(500).json({
            error: 'Webhook processing failed',
            message: error.message || 'Failed to process webhook'
        });
    }
});

module.exports = router;