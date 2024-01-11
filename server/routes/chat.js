const express = require('express');
const chatController = require('../controller/chatController');
const router = express.Router();

router.get('/messages', chatController.getMessages);

module.exports = router;
