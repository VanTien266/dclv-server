const mongoose = require("mongoose");

const { Schema } = mongoose;

const WarehouseSchema = new Schema(
  {
    id: { type: String, default: "" },
    address: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
  },
  { collection: "Warehouse" }
);

const Warehouse = mongoose.model("Warehouse", WarehouseSchema);

module.exports = { Warehouse };
