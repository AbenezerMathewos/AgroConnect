const express = require('express');
const router = express.Router();
const {
  getCropAdvisories,
  getAdvisoryById,
  diagnoseCropDisease,
} = require('../controllers/advisoryController');

router.get('/', getCropAdvisories);
router.post('/diagnose', diagnoseCropDisease);
router.get('/:id', getAdvisoryById);

module.exports = router;
