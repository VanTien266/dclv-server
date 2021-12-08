const mongoose = require("mongoose");
const { Schema } = mongoose;
const BillSchema = new Schema(
  {
    billID: {
      type: Number,
      default: "",
      required: true,
    },
    billStatus: {
      type: String,
      default: "",
      required: true,
    },
    valueBill: {
      type: Number,
      default: 0,
      required: true,
    },
    exportBillTime: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    shipperID: {
      type: String,
      default: "",
      required: false,
    },
    orderID: {
      type: Number,
      required: true,
    },
    clientID: {
      type: String,
      default: "",
      required: true,
    },
    salesmanID: {
      type: String,
      default: "",
      required: true,
    },
    fabrics: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "FabricRoll"
      },
    ],
  },
  { collection: "Bill" }
);
const Bill = mongoose.model("Bill", BillSchema);
module.exports = { Bill };
