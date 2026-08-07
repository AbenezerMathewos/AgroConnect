const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');

router.use(protect);
router.post('/', authorize('buyer'), createOrder);
router.get('/my', authorize('buyer', 'farmer'), getMyOrders);
router.patch('/:id/status', authorize('farmer'), updateOrderStatus);
module.exports = router;
