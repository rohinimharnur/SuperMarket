const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const Order = require('../models/Order');
const path = require('path');

// Show payment page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/demo1.html'));
});

// Save payment data and attach to order (accepts form or JSON)
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const {
      orderId,
      amount,
      payment,
      cardName,
      cardNumber,
      expiry,
      cvv,
      phonepeNumber,
      googlepayNumber
    } = body;

    // Handle card data safely: mask card number and DO NOT store CVV (PCI requirement)
    let safeCardNumber = null;
    let cardLast4 = null;
    if (cardNumber) {
      const digits = ('' + cardNumber).replace(/\D/g, '');
      cardLast4 = digits.slice(-4);
      safeCardNumber = cardLast4 ? `**** **** **** ${cardLast4}` : null;
    }

    const newPayment = new Payment({
      orderId: orderId || null,
      amount: amount ? parseFloat(amount) : 0,
      paymentMethod: payment || body.paymentMethod || null,
      cardName: cardName || '',
      cardNumber: safeCardNumber,
      cardLast4: cardLast4 || '',
      expiry: expiry || '',
      // cvv is intentionally NOT saved
      phonepeNumber,
      googlepayNumber,
      status: 'Completed'
    });

    const saved = await newPayment.save();

    // find or create order
    let attachedOrder = null;
    if (orderId) {
      attachedOrder = await Order.findOne({ orderId: orderId });
      if (!attachedOrder) {
        try { attachedOrder = await Order.findById(orderId); } catch (e) { attachedOrder = null; }
      }
    }

    // if order not found but request includes order fields, create order now
    if (!attachedOrder && (body.customerName || body.products || body.totalAmount)) {
      const createPayload = {
        customerName: body.customerName || body.name || 'Guest',
        customerEmail: body.customerEmail || body.email || '',
        customerPhone: body.customerPhone || body.phone || '',
        address: body.address || '',
        products: body.products || [],
        totalAmount: body.totalAmount || body.amount || 0,
        orderStatus: 'Payment Received'
      };
      try {
        attachedOrder = new Order(createPayload);
        await attachedOrder.save();
      } catch (e) {
        console.log('Error creating order from payment:', e.message);
      }
    }

    // attach payment to order if we have one
    let returnedOrder = null;
    if (attachedOrder) {
      attachedOrder.paymentId = saved._id;
      attachedOrder.orderStatus = 'Payment Received';
      await attachedOrder.save();
      returnedOrder = attachedOrder;
    }

    // If we created an order above, returnedOrder will be set. Try to populate and return the order object.
    if (returnedOrder) {
      try {
        const populated = await Order.findById(returnedOrder._id).populate('paymentId');
        returnedOrder = populated || returnedOrder;
      } catch (e) {
        // ignore populate errors
      }
    }

    res.status(201).json({ message: 'Payment saved', paymentId: saved._id, order: returnedOrder ? (returnedOrder.orderId || returnedOrder._id) : null, data: saved, order: returnedOrder });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error saving payment', details: err.message });
  }
});

module.exports = router;