const mongoo = require("mongoose");

const CartSchema = new mongoo.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoo.model("Cart", CartSchema);
