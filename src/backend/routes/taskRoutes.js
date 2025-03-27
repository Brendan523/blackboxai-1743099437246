const express = require('express');
const router = express.Router();
const logger = require('../logger');
const { 
    executeCommand, 
    executeBrowserTask, 
    monitorTask, 
    cancelTask 
} = require('../services/taskExecutor');

// Middleware to validate task requests
const validateTaskRequest = (req, res, next) => {
    if (!req.body.command && !req.body.browserTask) {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Command or browser task is required'
        });
    }
    next();
};

// Execute system command
router.post('/execute', validateTaskRequest, async (req, res) => {
    try {
        const result = await executeCommand(req.body.command);
        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        logger.error('Error executing command:', error);
        res.status(500).json({
            error: 'Task execution failed',
            message: error.message || 'Failed to execute command'
        });
    }
});

// Execute browser task
router.post('/browser', validateTaskRequest, async (req, res) => {
    try {
        const result = await executeBrowserTask(req.body.browserTask);
        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        logger.error('Error executing browser task:', error);
        res.status(500).json({
            error: 'Browser task execution failed',
            message: error.message || 'Failed to execute browser task'
        });
    }
});

// Monitor task status
router.get('/status/:taskId', async (req, res) => {
    try {
        const status = await monitorTask(req.params.taskId);
        res.json(status);
    } catch (error) {
        logger.error('Error monitoring task:', error);
        res.status(500).json({
            error: 'Task monitoring failed',
            message: error.message || 'Failed to monitor task'
        });
    }
});

// Cancel running task
router.post('/cancel/:taskId', async (req, res) => {
    try {
        const result = await cancelTask(req.params.taskId);
        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        logger.error('Error cancelling task:', error);
        res.status(500).json({
            error: 'Task cancellation failed',
            message: error.message || 'Failed to cancel task'
        });
    }
});

module.exports = router;