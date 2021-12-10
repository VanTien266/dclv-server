const { Order } = require("../models/Order");

async function getListOrderId() {
  const result = await Order.find({}).distinct("_id").exec();
  return result;
}

async function getOneOrder(id) {
  const result = await Order.find({ _id: id }).exec();
  return result[0];
}

module.exports = { getListOrderId, getOneOrder };
