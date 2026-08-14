const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const notifyUser = require('../utils/notify');

// @route   POST /api/orders
// @desc    Create a buy/order request with Telebirr / CBE Birr Escrow options
// @access  Private (buyer)
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, fulfillment, deliveryAddress, contactPhone, paymentMethod, note } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({ message: 'This product is no longer available' });
    }
    if (product.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own product' });
    }
    if (!quantity || Number(quantity) <= 0 || !contactPhone) {
      return res.status(400).json({ message: 'Quantity and contact phone are required' });
    }

    const qty = Number(quantity);
    const unitPrice = product.price;
    const totalPrice = Math.round(qty * unitPrice * 100) / 100;

    const chosenPayment = paymentMethod || 'telebirr';
    const isEscrow = ['telebirr', 'cbe_birr', 'chapa'].includes(chosenPayment);

    // Simulate escrow lock
    const escrowTxId = isEscrow ? `ET-ESCROW-${Date.now().toString().slice(-8)}` : '';
    const initialPaymentStatus = isEscrow ? 'escrow_held' : 'pending_payment';

    const order = await Order.create({
      product: product._id,
      buyer: req.user._id,
      farmer: product.owner,
      quantity: qty,
      unit: product.unit || 'Kg',
      unitPrice,
      totalPrice,
      fulfillment: fulfillment || 'pickup',
      deliveryAddress: deliveryAddress || {},
      contactPhone,
      paymentMethod: chosenPayment,
      paymentStatus: initialPaymentStatus,
      escrowTransactionId: escrowTxId,
      note: note || '',
      status: 'pending',
    });

    await notifyUser(product.owner, {
      type: 'order_new',
      message: `${req.user.name} requested ${qty} ${product.unit || 'Kg'} of ${product.title} (${totalPrice.toLocaleString()} ETB via ${chosenPayment.toUpperCase()})`,
      link: '/orders',
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Could not create order request', error: error.message });
  }
};

// @route   GET /api/orders/my
// @desc    Get logged in user's orders (buyer or farmer/cooperative)
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'farmer' || req.user.role === 'cooperative' ? { farmer: req.user._id } : { buyer: req.user._id };
    const orders = await Order.find(filter)
      .populate('product', 'title price location images region zone grade')
      .populate('buyer', 'name phone email')
      .populate('farmer', 'name phone email cooperativeName')
      .sort({ createdAt: -1 });

    // Buyers get a "reviewed" flag per order so the UI knows whether to show the review form
    if (req.user.role === 'buyer') {
      const reviewedIds = await Review.find({ buyer: req.user._id, order: { $in: orders.map((o) => o._id) } }).distinct('order');
      const reviewedSet = new Set(reviewedIds.map(String));
      const withFlag = orders.map((o) => ({ ...o.toObject(), reviewed: reviewedSet.has(String(o._id)) }));
      return res.json({ orders: withFlag });
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Could not load orders', error: error.message });
  }
};

// @route   PATCH /api/orders/:id/status
// @desc    Update order status (farmer accepts/ships/completes, or buyer confirms receipt)
// @access  Private (farmer, buyer)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'title price')
      .populate('buyer', 'name')
      .populate('farmer', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isFarmer = order.farmer._id.toString() === req.user._id.toString();
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();

    if (!isFarmer && !isBuyer && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const { status, paymentStatus } = req.body;

    if (status) {
      const validStatuses = ['pending', 'accepted', 'in_transit', 'declined', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // When status moves to completed and payment was in escrow, automatically disburse to farmer
    if (status === 'completed' && order.paymentStatus === 'escrow_held') {
      order.paymentStatus = 'released_to_farmer';
    }

    await order.save();

    const recipient = isFarmer ? order.buyer._id : order.farmer._id;
    await notifyUser(recipient, {
      type: 'order_status',
      message: `Order for ${order.product?.title || 'product'} is now ${order.status.toUpperCase()} (Payment: ${order.paymentStatus})`,
      link: '/orders',
    });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Could not update order', error: error.message });
  }
};

