const mongoose = require("mongoose");
const { Schema } = mongoose;
const BillSchema = new Schema(
  {
    billID: {
      type: Number,
      default: "",
      required: true,
    },
    status: [
      {
        name: { type: String, default: "exported" },
        date: { type: Date, default: Date.now() },
      },
    ],
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
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Staff",
    },
    orderID: {
      type: Schema.Types.ObjectId,
      default: null,
      required: true,
      ref: "Order",
    },
    clientID: {
      type: Schema.Types.ObjectId,
      default: null,
      // required: true,
      ref: "Customer",
    },
    salesmanID: {
      type: Schema.Types.ObjectId,
      default: null,
      required: true,
      ref: "Staff",
    },
    fabricRoll: [
      {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "FabricRoll",
      },
    ],
  },
  { collection: "Bill" }
);
const Bill = mongoose.model("Bill", BillSchema);
module.exports = { Bill };
