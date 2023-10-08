const express = require('express');
const router = express.Router();
const taskRouter = require('./router/task');
router.use('/api/tasks', taskRouter);
const chatRouter = require('./routers/chat');
router.use('/api/chat', chatRouter);
module.exports = router;