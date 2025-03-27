const { exec } = require('child_process');
const logger = require('../logger');

// Whitelist of allowed commands for security
const ALLOWED_COMMANDS = [
    'ls', 'dir', 'pwd', 'echo',
    'python', 'python3',
    'node', 'npm',
    'git status', 'git log'
];

// Validate if a command is allowed
const isCommandAllowed = (command) => {
    return ALLOWED_COMMANDS.some(allowed => command.startsWith(allowed));
};

// Sanitize command input
const sanitizeCommand = (command) => {
    // Remove potentially dangerous characters
    return command.replace(/[;&|`$]/g, '');
};

// Execute system commands
const executeCommand = async (command) => {
    try {
        // Sanitize and validate command
        const sanitizedCommand = sanitizeCommand(command);
        
        if (!isCommandAllowed(sanitizedCommand)) {
            logger.warn('Attempted to execute unauthorized command', { command });
            throw new Error('Command not allowed');
        }

        logger.info('Executing command', { command: sanitizedCommand });

        return new Promise((resolve, reject) => {
            exec(sanitizedCommand, {
                timeout: 30000, // 30 second timeout
                maxBuffer: 1024 * 1024 // 1MB buffer
            }, (error, stdout, stderr) => {
                if (error) {
                    logger.error('Command execution error:', error);
                    reject(error);
                    return;
                }

                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString(),
                    command: sanitizedCommand
                });
            });
        });
    } catch (error) {
        logger.error('Task execution error:', error);
        throw error;
    }
};

// Execute browser-based tasks
const executeBrowserTask = async (task) => {
    try {
        logger.info('Executing browser task', { task });
        
        // TODO: Implement browser automation logic
        // This is a placeholder for browser control implementation
        return {
            status: 'success',
            message: 'Browser task completed',
            task
        };
    } catch (error) {
        logger.error('Browser task execution error:', error);
        throw error;
    }
};

// Monitor task execution
const monitorTask = async (taskId) => {
    try {
        logger.info('Monitoring task', { taskId });
        
        // TODO: Implement task monitoring logic
        return {
            taskId,
            status: 'running',
            progress: 0,
            startTime: new Date().toISOString()
        };
    } catch (error) {
        logger.error('Task monitoring error:', error);
        throw error;
    }
};

// Cancel running task
const cancelTask = async (taskId) => {
    try {
        logger.info('Cancelling task', { taskId });
        
        // TODO: Implement task cancellation logic
        return {
            taskId,
            status: 'cancelled',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        logger.error('Task cancellation error:', error);
        throw error;
    }
};

module.exports = {
    executeCommand,
    executeBrowserTask,
    monitorTask,
    cancelTask
};