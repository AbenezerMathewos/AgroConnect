const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unit: { type: String, default: 'Kg', trim: true },
    fulfillment: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    contactPhone: { type: String, required: true, trim: true },
    note: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

orderSchema.index({ farmer: 1, status: 1, createdAt: -1 });
module.exports = mongoose.model('Order', orderSchema);
