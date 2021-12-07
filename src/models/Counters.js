const mongoose = require("mongoose");
const { Schema } = mongoose;
const CounterSchema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        sequence_value: {
            type: Number,
            required: true
        }
    },
    { collection: "Counters" }
);
const Counters = mongoose.model("Counters", CounterSchema);
module.exports = { Counters };