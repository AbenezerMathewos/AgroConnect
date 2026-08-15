const express = require('express');
const router = express.Router();
const {
  getCropAdvisories,
  getAdvisoryById,
  diagnoseCropDisease,
  createCropAdvisory,
} = require('../controllers/advisoryController');

router.get('/', getCropAdvisories);
router.post('/', createCropAdvisory);
router.post('/diagnose', diagnoseCropDisease);
router.get('/:id', getAdvisoryById);

module.exports = router;
