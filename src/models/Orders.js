const mongoose = require("mongoose");
const { Schema } = mongoose;
const OrderSchema = new Schema(
    {
        id: {
            type: String,
            default: "",
            required: true,
        },
        status: {
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
        address: {
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
    },
    { collection: "Orders" }
);
const Orders = mongoose.model("Orders", OrderSchema);
module.exports = { Orders };
