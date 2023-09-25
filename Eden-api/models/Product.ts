const Mongo = require("mongoose");

const ProductSchema = new Mongo.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    InStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = Mongo.model("Product", ProductSchema);
