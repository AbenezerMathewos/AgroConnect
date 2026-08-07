const MarketPrice = require('../models/MarketPrice');

exports.getMarketPrices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.crop) filter.crop = { $regex: req.query.crop, $options: 'i' };
    if (req.query.market) filter.market = { $regex: req.query.market, $options: 'i' };
    const prices = await MarketPrice.find(filter).sort({ recordedAt: -1 }).limit(100);
    res.json({ prices });
  } catch (error) { res.status(500).json({ message: 'Could not load market prices', error: error.message }); }
};

exports.createMarketPrice = async (req, res) => {
  try {
    const { crop, market, lowPrice, highPrice, unit, recordedAt } = req.body;
    if (!crop || !market || lowPrice === undefined || highPrice === undefined || Number(lowPrice) > Number(highPrice)) return res.status(400).json({ message: 'Enter a crop, market, and valid price range' });
    const price = await MarketPrice.create({ crop, market, lowPrice, highPrice, unit, recordedAt });
    res.status(201).json({ price });
  } catch (error) { res.status(500).json({ message: 'Could not save market price', error: error.message }); }
};

exports.deleteMarketPrice = async (req, res) => {
  try {
    const price = await MarketPrice.findByIdAndDelete(req.params.id);
    if (!price) return res.status(404).json({ message: 'Price record not found' });
    res.json({ message: 'Price record deleted' });
  } catch (error) { res.status(500).json({ message: 'Could not delete market price', error: error.message }); }
};
