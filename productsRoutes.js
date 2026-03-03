const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
router.get('/', async (req, res) => {
const search = req.query.search;
const data = search
? await Product.find({ name: { $regex: search, $options: 'i' } })
: await Product.find();
res.json(data);
});
router.post('/add', async (req, res) => {
await new Product(req.body).save();
res.json({ message: 'Product added' });
});
module.exports = router; 