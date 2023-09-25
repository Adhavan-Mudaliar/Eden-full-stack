const User1 = require("../models/User");
var router = require("express").Router();
var Crypt = require("crypto-js");
var verifyTokenAuthorization = require("./verifyToken");
var verifyTokenAdmin = require("./verifyToken");

//UPDATE

router.put("/:id", verifyTokenAuthorization, async (req: any, res: any) => {
  if (req.body.password) {
    req.body.password = Crypt.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User1.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...other } = updatedUser._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verifyTokenAuthorization, async (req: any, res: any) => {
  try {
    await User1.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER

router.get("/find/:id", verifyTokenAdmin, async (req: any, res: any) => {
  try {
    const user = await User1.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USERS

router.get("/", verifyTokenAdmin, async (req: any, res: any) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User1.find().sort({ _id: -1 }).limit(5)
      : await User1.find();
    // const { password, ...others } = users;
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", verifyTokenAdmin, async (req: any, res: any) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User1.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          totalUsers: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
