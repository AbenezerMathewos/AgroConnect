const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  startOrGetConversation,
  getMyConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');

router.use(protect);
router.use(authorize('buyer', 'farmer'));

router.post('/conversations', authorize('buyer'), startOrGetConversation);
router.get('/conversations', getMyConversations);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);

module.exports = router;
