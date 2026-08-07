const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    market: { type: String, required: true, trim: true },
    lowPrice: { type: Number, required: true, min: 0 },
    highPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'Kg', trim: true },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

marketPriceSchema.index({ crop: 1, market: 1, recordedAt: -1 });
module.exports = mongoose.model('MarketPrice', marketPriceSchema);
