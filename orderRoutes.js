const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE Order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order Placed Successfully ✅", data: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found ❌" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Order Status
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Order Updated ✅", data: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order Deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;