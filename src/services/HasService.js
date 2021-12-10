const { Has } = require("../models/Has");

async function getListHasOfOrder(id) {
  const result = await Has.find({ orderId: id }).distinct("_id").exec();
  return result;
}

module.exports = { getListHasOfOrder };
