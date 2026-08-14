const MarketPrice = require('../models/MarketPrice');

// @route   GET /api/market-prices
// @desc    Get nationwide market prices with region/crop filters
// @access  Public
exports.getMarketPrices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.crop) filter.crop = { $regex: req.query.crop, $options: 'i' };
    if (req.query.market) filter.market = { $regex: req.query.market, $options: 'i' };
    if (req.query.region) filter.region = { $regex: req.query.region, $options: 'i' };
    const prices = await MarketPrice.find(filter).sort({ recordedAt: -1 }).limit(200);
    res.json({ prices });
  } catch (error) {
    res.status(500).json({ message: 'Could not load market prices', error: error.message });
  }
};

// @route   GET /api/market-prices/arbitrage
// @desc    Get price comparisons between terminal markets (Addis/Adama) and regional farmgates
// @access  Public
exports.getArbitrageRadar = async (req, res) => {
  try {
    const allPrices = await MarketPrice.find().sort({ recordedAt: -1 });

    // Group by crop
    const cropsMap = {};
    allPrices.forEach((p) => {
      if (!cropsMap[p.crop]) cropsMap[p.crop] = [];
      cropsMap[p.crop].push(p);
    });

    const arbitrageData = Object.entries(cropsMap).map(([crop, records]) => {
      const sorted = [...records].sort((a, b) => b.highPrice - a.highPrice);
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      const spread = highest.highPrice - lowest.lowPrice;
      const spreadPercentage = lowest.lowPrice > 0 ? Math.round((spread / lowest.lowPrice) * 100) : 0;

      return {
        crop,
        highestMarket: { market: highest.market, region: highest.region, price: highest.highPrice, unit: highest.unit },
        lowestMarket: { market: lowest.market, region: lowest.region, price: lowest.lowPrice, unit: lowest.unit },
        spread,
        spreadPercentage,
        recordsCount: records.length,
      };
    });

    res.json({ arbitrage: arbitrageData.sort((a, b) => b.spreadPercentage - a.spreadPercentage) });
  } catch (error) {
    res.status(500).json({ message: 'Could not calculate market arbitrage', error: error.message });
  }
};

// @route   POST /api/market-prices
// @access  Private (admin)
exports.createMarketPrice = async (req, res) => {
  try {
    const { crop, market, region, marketType, lowPrice, highPrice, unit, trend, recordedAt } = req.body;
    if (!crop || !market || lowPrice === undefined || highPrice === undefined || Number(lowPrice) > Number(highPrice)) {
      return res.status(400).json({ message: 'Enter a crop, market, and valid price range' });
    }

    const low = Number(lowPrice);
    const high = Number(highPrice);
    const avg = Math.round(((low + high) / 2) * 10) / 10;

    const price = await MarketPrice.create({
      crop,
      market,
      region: region || 'South Ethiopia',
      marketType: marketType || 'Regional Hub',
      lowPrice: low,
      highPrice: high,
      averagePrice: avg,
      unit: unit || 'Quintal',
      trend: trend || 'stable',
      recordedAt: recordedAt || Date.now(),
    });
    res.status(201).json({ price });
  } catch (error) {
    res.status(500).json({ message: 'Could not save market price', error: error.message });
  }
};

// @route   DELETE /api/market-prices/:id
// @access  Private (admin)
exports.deleteMarketPrice = async (req, res) => {
  try {
    const price = await MarketPrice.findByIdAndDelete(req.params.id);
    if (!price) return res.status(404).json({ message: 'Price record not found' });
    res.json({ message: 'Price record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete market price', error: error.message });
  }
};

