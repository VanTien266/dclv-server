const mongoose = require("mongoose");
const { Schema } = mongoose;
const HasSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    colorCode: {
      type: Schema.Types.ObjectId,
      default: null,
      required: true,
      ref: "Item",
    },
    length: {
      type: Number,
      default: 0,
      required: true,
    },
    shippedLength: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { collection: "Has" }
);
const Has = mongoose.model("Has", HasSchema);
module.exports = { Has };
