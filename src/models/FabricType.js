const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FabricTypeSchema = new Schema(
  {
    id: { type: String, default: "", required: true },
    name: { type: String, default: "", required: true },
  },
  { collection: "FabricType" }
);

const FabricType = mongoose.model("FabricType", FabricTypeSchema);

module.exports = { FabricType };
