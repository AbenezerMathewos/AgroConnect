const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const notifyUser = require('../utils/notify');

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, fulfillment, contactPhone, note } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) return res.status(404).json({ message: 'This product is no longer available' });
    if (product.owner.toString() === req.user._id.toString()) return res.status(400).json({ message: 'You cannot request your own product' });
    if (!quantity || Number(quantity) <= 0 || !contactPhone) return res.status(400).json({ message: 'Quantity and contact phone are required' });
    const order = await Order.create({ product: product._id, buyer: req.user._id, farmer: product.owner, quantity, unit: product.unit, fulfillment, contactPhone, note });

    await notifyUser(product.owner, {
      type: 'order_new',
      message: `${req.user.name} requested ${quantity} ${product.unit || 'Kg'} of ${product.title}`,
      link: '/orders',
    });

    res.status(201).json({ order });
  } catch (error) { res.status(500).json({ message: 'Could not create order request', error: error.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'farmer' ? { farmer: req.user._id } : { buyer: req.user._id };
    const orders = await Order.find(filter).populate('product', 'title price location images').populate('buyer', 'name').populate('farmer', 'name').sort({ createdAt: -1 });

    // Buyers get a "reviewed" flag per order so the UI knows whether to show the review form
    if (req.user.role === 'buyer') {
      const reviewedIds = await Review.find({ buyer: req.user._id, order: { $in: orders.map((o) => o._id) } }).distinct('order');
      const reviewedSet = new Set(reviewedIds.map(String));
      const withFlag = orders.map((o) => ({ ...o.toObject(), reviewed: reviewedSet.has(String(o._id)) }));
      return res.json({ orders: withFlag });
    }

    res.json({ orders });
  } catch (error) { res.status(500).json({ message: 'Could not load orders', error: error.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product', 'title');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only the farmer can update this request' });
    if (!['accepted', 'declined', 'completed'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' });
    order.status = req.body.status;
    await order.save();

    const STATUS_LABEL = { accepted: 'accepted', declined: 'declined', completed: 'marked completed' };
    await notifyUser(order.buyer, {
      type: 'order_status',
      message: `Your request for ${order.product?.title || 'a product'} was ${STATUS_LABEL[order.status] || order.status}`,
      link: '/orders',
    });

    res.json({ order });
  } catch (error) { res.status(500).json({ message: 'Could not update order', error: error.message }); }
};
