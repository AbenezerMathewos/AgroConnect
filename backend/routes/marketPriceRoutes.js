const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMarketPrices, createMarketPrice, deleteMarketPrice } = require('../controllers/marketPriceController');

router.get('/', getMarketPrices);
router.post('/', protect, authorize('admin'), createMarketPrice);
router.delete('/:id', protect, authorize('admin'), deleteMarketPrice);
module.exports = router;
