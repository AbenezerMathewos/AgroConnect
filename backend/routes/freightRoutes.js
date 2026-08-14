const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getFreightTrips, createFreightTrip, bookFreightSpace } = require('../controllers/freightController');

router.get('/', getFreightTrips);
router.post('/', protect, createFreightTrip);
router.patch('/:id/book', protect, bookFreightSpace);

module.exports = router;
