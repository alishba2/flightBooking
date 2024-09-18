const mongoose = require('mongoose');

const FlightNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the alert
  queryDetails: {
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    passengers: { type: Number, default: 1 },
    travelClass: { type: String, default: 'economy' },
    currency: { type: String, default: 'USD' },
  },
  previousPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FlightNotification', FlightNotificationSchema);
