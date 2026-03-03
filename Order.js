const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
  customerName: { type: String, required: true },
  customerEmail: { type: String },      // optional
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  products: [productSchema],
  totalAmount: { type: Number, required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  orderStatus: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);