const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = new Schema(
    {
        orderId: {
            type: Number,
            default: 0,
            required: true,
        },
        orderStatus: {
            type: String,
            default: "",
            required: true,
        },
        note: {
            type: String,
            default: "",
            required: false,
        },
        orderTime: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        receiverName: {
            type: String,
            default: "",
            required: false,
        },
        receiverPhone: {
            type: String,
            default: "",
            required: false,
        },
        receiverAddress: {
            type: String,
            default: "",
            required: true,
        },
        deposit: {
            type: Number,
            default: 0,
            required: false,
        },
        clientID: {
            type: String,
            default: "",
            required: true,
        },
        detailBill: {
            type: [Number],
            required: false,
        },
        products: {
            type: [String],
            required: true,
        },
    },
    { collection: "Orders" }
);
const Orders = mongoose.model("Orders", OrderSchema);
module.exports = { Orders };
