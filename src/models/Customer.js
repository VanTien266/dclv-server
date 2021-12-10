const mongoose = require("mongoose");
const {Schema} = mongoose;

const CustomerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true,
        default: Date.now()
    },
    type: {
        type: Boolean,
        required: true
    },
}, {collection: "Customer"});
const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = { Customer };



