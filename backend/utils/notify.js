const Notification = require('../models/Notification');
const { getIO } = require('../socket');

// Creates a persisted notification and, if the recipient has a live socket
// connection, pushes it to them immediately for the notification bell.
async function notifyUser(recipientId, { type, message, link = '' }) {
  const notification = await Notification.create({ recipient: recipientId, type, message, link });

  const io = getIO();
  if (io) {
    io.to(`user:${recipientId}`).emit('notification:new', notification);
  }

  return notification;
}

module.exports = notifyUser;
