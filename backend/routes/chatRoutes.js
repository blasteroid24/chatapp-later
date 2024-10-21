const express = require('express');
const { getMessages, createRoom } = require('../controllers/chatController');

const router = express.Router();

// Get messages for a specific room
router.get('/messages/:room', getMessages);

// Create a new room
router.post('/rooms', createRoom);

module.exports = router;
