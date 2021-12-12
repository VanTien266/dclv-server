const mongoose = require("mongoose");
const { Schema } = mongoose;

const StaffSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    role: {
      type: String,
      required: true,
    },
  },
  { collection: "Staff" }
);
const Staff = mongoose.model("Staff", StaffSchema);
module.exports = { Staff };
