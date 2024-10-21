const Message = require('../models/Message');
const Room = require('../models/Room');

// Get messages for a specific room
const getMessages = async (req, res) => {
  const { room } = req.params;
  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Create a new room
const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const newRoom = new Room({ name });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
};

module.exports = {
  getMessages,
  createRoom,
};
