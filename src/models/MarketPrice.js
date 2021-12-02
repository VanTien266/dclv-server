const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MarketPriceSchema = new Schema(
  {
    dayApplied: { type: Date, default: Date.now() },
    price: { type: String, default: "", required: true },
  },
  { collection: "MarketPrice" }
);

const MarketPrice = mongoose.model("MarketPrice", MarketPriceSchema);

module.exports = { MarketPrice };
