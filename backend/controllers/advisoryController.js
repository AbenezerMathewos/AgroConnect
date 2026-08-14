const CropAdvisory = require('../models/CropAdvisory');

// @route   GET /api/advisory
// @desc    Get crop pest/disease diagnostics and agronomic advice
// @access  Public
exports.getCropAdvisories = async (req, res) => {
  try {
    const { crop, search } = req.query;
    const filter = {};

    if (crop) filter.cropName = { $regex: crop, $options: 'i' };
    if (search) {
      filter.$or = [
        { cropName: { $regex: search, $options: 'i' } },
        { pestOrDisease: { $regex: search, $options: 'i' } },
        { 'localNames.am': { $regex: search, $options: 'i' } },
        { 'symptoms.en': { $regex: search, $options: 'i' } },
        { 'symptoms.am': { $regex: search, $options: 'i' } },
      ];
    }

    const advisories = await CropAdvisory.find(filter).sort({ cropName: 1 });
    res.json({ advisories });
  } catch (error) {
    res.status(500).json({ message: 'Could not load crop advisory data', error: error.message });
  }
};

// @route   GET /api/advisory/:id
// @desc    Get single advisory details
// @access  Public
exports.getAdvisoryById = async (req, res) => {
  try {
    const advisory = await CropAdvisory.findById(req.params.id);
    if (!advisory) return res.status(404).json({ message: 'Advisory not found' });
    res.json({ advisory });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advisory', error: error.message });
  }
};
