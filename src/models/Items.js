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
    marketPriceId: [{ type: mongoose.Types.ObjectId }],
    name: { type: String, default: "" },
  },
  { collection: "Items" }
);

const Items = mongoose.model("Items", ItemSchema);

module.exports = { Items };
