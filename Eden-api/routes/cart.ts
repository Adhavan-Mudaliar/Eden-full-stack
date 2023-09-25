const Cart = require("../models/Cart");
var router = require("express").Router();
var Crypt = require("crypto-js");
var verifyTokenAuthorization = require("./verifyToken");
var verifyTokenAdmin = require("./verifyToken");

//CREATE
router.post("/", verifyTokenAuthorization, async (req: any, res: any) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART

router.get("/find/:id", async (req: any, res: any) => {
  try {
    const cart = await Cart.findOne(req.params.id);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE

router.put("/:id", verifyTokenAuthorization, async (req: any, res: any) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...other } = updatedCart._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verifyTokenAuthorization, async (req: any, res: any) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL CARTS

router.get("/", verifyTokenAdmin, async (req: any, res: any) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
