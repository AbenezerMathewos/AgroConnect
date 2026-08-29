const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, updateOrderStatus, payOrder } = require('../controllers/orderController');

router.use(protect);
router.post('/', authorize('buyer', 'admin'), createOrder);
router.get('/my', authorize('buyer', 'farmer', 'cooperative', 'admin'), getMyOrders);
router.patch('/:id/status', authorize('buyer', 'farmer', 'cooperative', 'admin'), updateOrderStatus);
router.post('/:id/pay', authorize('buyer', 'admin'), payOrder);

module.exports = router;

