const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: String },
  amount: { type: Number, default: 0 },
  paymentMethod: { type: String },
  cardName: String,
  // store masked card data only (do NOT store CVV)
  cardNumber: String,
  cardLast4: String,
  expiry: String,
  phonepeNumber: String,
  googlepayNumber: String,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);