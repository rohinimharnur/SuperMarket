const express = require('express');
const Cart = require('../models/Carts');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        products: []
      });
    }

    cart.products.push({ productId, quantity });
    await cart.save();

    res.json({ message: 'Added to cart ✅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error ❌' });
  }
});

module.exports = router;