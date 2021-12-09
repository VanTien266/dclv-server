const mongoose = require("mongoose");
const { Schema } = mongoose;
const BillSchema = new Schema(
  {
    billID: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      default: "",
    },
    orderID: {
      type: Schema.Types.ObjectId,
      default: "",
      required: true,
    },
    clientID: {
      type: Schema.Types.ObjectId,
      default: "",
      required: true,
    },
    salesmanID: {
      type: String,
      default: "",
      required: true,
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
