const Order = require("../models/Order");
var router = require("express").Router();
var Crypt = require("crypto-js");
var verifyTokenAuthorization = require("./verifyToken");
var verifyTokenAdmin = require("./verifyToken");

//CREATE
router.post("/", verifyTokenAuthorization, async (req: any, res: any) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDER

router.get("/find/:id", async (req: any, res: any) => {
  try {
    const order = await Order.find(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE

router.put("/:id", verifyTokenAdmin, async (req: any, res: any) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...other } = updatedOrder._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verifyTokenAdmin, async (req: any, res: any) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL ORDERS

router.get("/", verifyTokenAdmin, async (req: any, res: any) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ORDER STATS

router.get("/stats", verifyTokenAdmin, async (req: any, res: any) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(
    new Date(date.setMonth(lastMonth.getMonth() - 1))
  );
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
