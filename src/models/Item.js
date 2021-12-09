const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    colorCode: { type: String, default: "", required: true },
    typeId: {
      type: Schema.Types.ObjectId,
      default: "",
      required: true,
      ref: "FabricType",
    },
    marketPriceId: [{ type: mongoose.Types.ObjectId, ref: "MarketPrice" }],
    name: { type: String, default: "" },
  },
  { collection: "Item" }
);

const Item = mongoose.model("Item", ItemSchema);

module.exports = { Item };
