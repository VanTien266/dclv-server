const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    colorCode: { type: String, default: "", required: true },
    typeId: { type: String, default: "", required: true },
    dayApplied: { type: Date, default: Date.now() },
    name: { type: String, default: "" },
  },
  { collection: "Item" }
);

const Item = mongoose.model("Item", ItemSchema);

module.exports = { Item };
