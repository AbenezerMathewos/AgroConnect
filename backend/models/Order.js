const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unit: { type: String, default: 'Kg', trim: true },
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    fulfillment: { type: String, enum: ['pickup', 'delivery', 'freight_pool'], default: 'pickup' },
    deliveryAddress: {
      region: { type: String, default: '' },
      city: { type: String, default: '' },
      specificAddress: { type: String, default: '' },
    },
    contactPhone: { type: String, required: true, trim: true },
    paymentMethod: {
      type: String,
      enum: ['telebirr', 'cbe_birr', 'chapa', 'cash_on_delivery'],
      default: 'telebirr',
    },
    paymentStatus: {
      type: String,
      enum: ['pending_payment', 'escrow_held', 'released_to_farmer', 'refunded'],
      default: 'pending_payment',
    },
    escrowTransactionId: {
      type: String,
      default: '',
    },
    note: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_transit', 'declined', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

orderSchema.index({ farmer: 1, status: 1, createdAt: -1 });
orderSchema.index({ buyer: 1, createdAt: -1 });
module.exports = mongoose.model('Order', orderSchema);

