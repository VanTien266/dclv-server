const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FabricRollSchema = new Schema(
  {
    status: { type: Boolean, default: true },
    dayAdded: { type: Date, default: Date.now() },
    length: { type: Number, default: 0 },
    lot: { type: String, default: "" },
    warehouseId: { type: String, default: "" },
    billId: { type: String, default: "" },
    colorCode: {
      type: String,
      default: "",
      required: true,
    },
  },
  { collection: "FabricRoll" }
);

const FabricRoll = mongoose.model("FabricRoll", FabricRollSchema);

module.exports = { FabricRoll };
