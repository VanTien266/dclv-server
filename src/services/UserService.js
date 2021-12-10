const { Staff } = require("../models/Staff");
const { Customer } = require("../models/Customer");

async function getListSalesmanId() {
  const result = await Staff.find({ role: "Nhân viên bán hàng" })
    .distinct("_id")
    .exec();
  return result;
}

async function getListShipperId() {
  const result = await Staff.find({ role: "Nhân viên giao hàng" })
    .distinct("_id")
    .exec();
  return result;
}

async function getListCustomerId() {
  const result = await Customer.find({}).distinct("_id").exec();
  return result;
}

module.exports = { getListSalesmanId, getListCustomerId, getListShipperId };
