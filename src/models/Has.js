const mongoose = require("mongoose");
const { Schema } = mongoose;
const HasSchema = new Schema(
    {
        orderId: {
            type: Number,
            default: "",
            required: true,
        },
        colorCode: {
            type: Schema.Types.ObjectId,
            default: "",
            required: true,
            ref: "Items"
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
        }
    },
    { collection: "Has" }
);
const Has = mongoose.model("Has", HasSchema);
module.exports = { Has };
