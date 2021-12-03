const mongoose = require("mongoose");
const {Schema} = mongoose;

const ClientSchema = new Schema({
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
        type: String,
        required: true
    },
}, {collection: "Clients"});
const Clients = mongoose.model("Clients", ClientSchema);
module.exports = { Clients };



