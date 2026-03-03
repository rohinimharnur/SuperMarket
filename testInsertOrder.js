require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const order = new Order({
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      customerPhone: '9999999999',
      address: '123 Test St',
      products: [
        { productName: 'Sample Item', quantity: 2, price: 49.99 }
      ],
      totalAmount: 99.98,
      orderStatus: 'Pending'
    });

    const saved = await order.save();
    console.log('Saved order id:', saved._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err);
    try { await mongoose.disconnect(); } catch(e) {}
    process.exit(1);
  }
}

run();
