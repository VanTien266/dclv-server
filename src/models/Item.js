const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    colorCode: { type: String, default: "", required: true},
    typeId: { type: String, default: "", required: true},
    marketPriceId: [{ type: mongoose.Types.ObjectId }],
    name: { type: String, default: "" },
  },
  { collection: "Item" }
);

const Item = mongoose.model("Item", ItemSchema);

module.exports = { Item };
