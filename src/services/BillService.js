const { Bill } = require("../models/Bill");

async function getListOrderId() {
  const result = await Bill.find({}).distinct("orderID").exec();
  return result;
}
async function getListProductOfOrder(orderId) {
  const result = [];
  const data = await Bill.find({ orderID: orderId })
    .populate({ path: "fabricRoll" })
    .exec();
  data.forEach((item) => {
    result.push(...item.fabricRoll);
  });
  return result;
}
async function getListBillOfOrder(orderId) {
  const result = [];
  const data = await Bill.find({ orderID: orderId }).exec();
  data.forEach((item) => {
    result.push(item._id);
  });
  return result;
}

async function getListBillId() {
  const result = await Bill.find({}).distinct("_id").exec();
  return result;
}

async function getClientId(billId) {
  const result = await Bill.findOne({ _id: billId })
    .populate({ path: "orderID", select: "clientID" })
    .exec();
  return result;
}

module.exports = {
  getListOrderId,
  getListProductOfOrder,
  getListBillOfOrder,
  getListBillId,
  getClientId,
};
