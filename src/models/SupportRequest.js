const mongoose = require("mongoose");
const { Schema } = mongoose;

const SupportRequestSchema = new Schema(
  {
    supportId: { type: Number, require: true },
    status: {
      type: Boolean,
      required: true,
    },
    request: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      default: "",
    },
    requestTime: {
      type: Date,
      default: Date.now(),
    },
    responseTime: {
      type: Date,
      default: null,
    },
    orderId: { type: Schema.Types.ObjectId, required: true },
    salesmanId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { collection: "SupportRequest" }
);
const SupportRequest = mongoose.model("SupportRequest", SupportRequestSchema);
module.exports = { SupportRequest };
