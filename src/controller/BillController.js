const { Bill } = require("../models/Bill");
const { Order } = require("../models/Order");
const { Customer } = require("../models/Customer");
const { Staff } = require("../models/Staff");
const { Has } = require("../models/Has");
const { FabricRoll } = require("../models/FabricRoll");
const { Counter } = require("../models/Counter");
const mailApi = require("../utils/axios/mailApi");
const mongoose = require("mongoose");
const qs = require("qs");

const { ValidateOrder } = require("../services/Order/ValidateOrder");
const { hashSync } = require("bcryptjs");
const { constant } = require("lodash");

async function getNextSequenceValue(sequenceName) {
  let seq = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

const createBill = async (req, res) => {
  const id = await getNextSequenceValue("billId");
  // Change status of FabricRoll from true->false
  const listFabricRoll = await Promise.all(
    req.body.ids?.map(async (item, idx) => {
      let fabricRollId = await FabricRoll.findOneAndUpdate(
        { _id: item },
        { status: false }
      );
      return fabricRollId;
    })
  );

  // Create Bill and add to list bill of Order
  const billObjId = new mongoose.Types.ObjectId();
  const order = await Order.findOneAndUpdate(
    { _id: req.body.orderId },
    { $push: { detailBill: billObjId } }
  );
  let result = await Bill.create({
    _id: billObjId,
    billID: id,
    valueBill: 0,
    orderID: mongoose.Types.ObjectId(req.body.orderId),
    clientID: order.clientID,
    salesmanID: mongoose.Types.ObjectId("61b1d9600f59311316f228ea"),
    fabricRoll: req.body.ids,
    note: order.note,
    status: [
      {
        name: "exported",
        date: Date.now(),
        reason: "",
      },
    ],
  });
  const customer = await Customer.aggregate([
    { $match: { _id: order.clientID } },
  ]);

  //send email
  const data = {
    email_type: "export_bill_success",
    email: customer.email,
    subject: "Xuất thành công hóa đơn",
    order_id: order.orderId,
    bill_id: id,
    customer_name: customer.name,
    order_status: "",
    bill_status: "",
  };
  mailApi.sendEmail(data);
  ValidateOrder(req.body.orderId);

  res.send("Ok");
};

const getListBill = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      {
        $lookup: {
          from: "Order",
          let: { id_Order: "$orderID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Order"] } } }],
          as: "orderID",
        },
      },
      {
        $lookup: {
          from: "Staff",
          let: { id_Saleman: "$salesmanID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Saleman"] } } }],
          as: "salesmanID",
        },
      },
      {
        $lookup: {
          from: "Customer",
          let: { id_Customer: "$clientID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Customer"] } } }],
          as: "clientID",
        },
      },
      { $unwind: "$orderID" },
      { $unwind: "$salesmanID" },
      { $unwind: "$clientID" },
    ]);
    console.log("Get List Bill successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getListBillComplete = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $addFields: { lastStatus: { $last: "$status" } } },
      { $match: { "lastStatus.name": "completed" } },
      {
        $lookup: {
          from: "Order",
          let: { id_Order: "$orderID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Order"] } } }],
          as: "orderID",
        },
      },
      {
        $lookup: {
          from: "Staff",
          let: { id_Saleman: "$salesmanID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Saleman"] } } }],
          as: "salesmanID",
        },
      },
      {
        $lookup: {
          from: "Customer",
          let: { id_Customer: "$clientID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Customer"] } } }],
          as: "clientID",
        },
      },
      { $unwind: "$orderID" },
      { $unwind: "$salesmanID" },
      { $unwind: "$clientID" },
    ]);
    console.log("Get List Bill Completed successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};
const getListBillUncomplete = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      {
        $addFields: {
          lengthStatus: {
            $cond: {
              if: { $isArray: "$status" },
              then: { $size: "$status" },
              else: "NA",
            },
          },
        },
      },
      { $match: { lengthStatus: { $lt: 7 } } },
      { $addFields: { lastStatus: { $last: "$status" } } },
      { $match: { "lastStatus.name": { $ne: "completed" } } },
      {
        $lookup: {
          from: "Order",
          let: { id_Order: "$orderID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Order"] } } }],
          as: "orderID",
        },
      },
      {
        $lookup: {
          from: "Staff",
          let: { id_Saleman: "$salesmanID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Saleman"] } } }],
          as: "salesmanID",
        },
      },
      {
        $lookup: {
          from: "Customer",
          let: { id_Customer: "$clientID" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$id_Customer"] } } }],
          as: "clientID",
        },
      },
      { $unwind: "$orderID" },
      { $unwind: "$salesmanID" },
      { $unwind: "$clientID" },
    ]);
    console.log("Get List Bill UnCompleted successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getListBillByIds = async (req, res) => {
  try {
    const body = qs.parse(req.body);
    const ids = body.ids || [];
    const result = await Bill.aggregate([{ $match: { _id: ids } }]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getListBillByOrderId = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.orderid);
    const result = await Bill.aggregate([{ $match: { orderID: id } }]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getBillDetail = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const result = await Bill.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "Staff",
          let: { id_Shipper: "$shipperID" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id_Shipper"] } } },
            { $project: { _id: 1, name: 1, phone: 1 } },
          ],
          as: "shipperID",
        },
      },
      { $unwind: { path: "$shipperID", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "Order",
          let: { id_Order: "$orderID" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id_Order"] } } },
            {
              $project: {
                _id: 1,
                receiverName: 1,
                receiverPhone: 1,
                receiverAddress: 1,
              },
            },
          ],
          as: "orderID",
        },
      },
      { $unwind: { path: "$orderID", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "Staff",
          let: { id_Saleman: "$salesmanID" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id_Saleman"] } } },
            { $project: { _id: 1, name: 1, phone: 1 } },
          ],
          as: "salesmanID",
        },
      },
      {
        $lookup: {
          from: "Customer",
          let: { id_Customer: "$clientID" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id_Customer"] } } },
            { $project: { _id: 1, name: 1, email: 1, phone: 1, address: 1 } },
          ],
          as: "clientID",
        },
      },
      { $unwind: { path: "$clientID", preserveNullAndEmptyArrays: true } },
    ]);
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getBillComplete = async (req, res) => {
  try {
    if (req.query.date) {
      selectDate = req.query.date;
      yearSel = Number(selectDate.slice(0, 4));
      monthSel = Number(selectDate.slice(5, 7));
    } else {
      selectDate = new Date();
      monthSel = selectDate.getMonth() + 1;
      yearSel = selectDate.getFullYear();
    }
    const resultBillCompleted = await Bill.aggregate([
      { $unwind: "$status" },
      { $match: { "status.name": "completed" } },
      { $addFields: { month: { $month: "$status.date" } } },
      { $addFields: { year: { $year: "$status.date" } } },
      { $match: { year: yearSel } },
      { $match: { month: monthSel } },
      { $project: { _id: 1 } },
      {
        $group: {
          _id: null,
          billcompleted: { $sum: 1 },
        },
      },
    ]);

    let result = 0;
    if (resultBillCompleted?.length === 0) {
      result = "0";
    } else {
      resultBillCompleted.map((item) => (result = item.billcompleted));
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getFabricRollBillCompleted = async (req, res) => {
  try {
    if (req.query.date) {
      selectDate = req.query.date;
      yearSel = Number(selectDate.slice(0, 4));
      monthSel = Number(selectDate.slice(5, 7));
    } else {
      selectDate = new Date();
      monthSel = selectDate.getMonth() + 1;
      yearSel = selectDate.getFullYear();
    }
    const resultFabricRollBill = await Bill.aggregate([
      { $unwind: "$status" },
      { $match: { "status.name": "completed" } },
      { $addFields: { month: { $month: "$status.date" } } },
      { $addFields: { year: { $year: "$status.date" } } },
      { $match: { year: yearSel } },
      { $match: { month: monthSel } },
      { $project: { fabricRoll: 1 } },
      { $unwind: "$fabricRoll" },
      { $count: "fabricRoll" },
    ]);

    let result;
    if (resultFabricRollBill?.length === 0) result = "0";
    else {
      resultFabricRollBill.map((item) => (result = item.fabricRoll));
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getBillFabricTypeSell = async (req, res) => {
  try {
    if (req.query.date) {
      selectDate = req.query.date;
      yearSel = Number(selectDate.slice(0, 4));
      monthSel = Number(selectDate.slice(5, 7));
    } else {
      selectDate = new Date();
      monthSel = selectDate.getMonth() + 1;
      yearSel = selectDate.getFullYear();
    }
    const result = await Bill.aggregate([
      { $project: { _id: 1, exportBillTime: 1, fabricRoll: 1 } },
      { $addFields: { month: { $month: "$exportBillTime" } } },
      { $addFields: { year: { $year: "$exportBillTime" } } },
      { $match: { year: yearSel } },
      { $match: { month: monthSel } },
      { $unwind: "$fabricRoll" },
      {
        $lookup: {
          from: "FabricRoll",
          let: { bill_fabricRoll: "$fabricRoll" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$bill_fabricRoll"] } } },
            {
              $lookup: {
                from: "Item",
                let: { color_code: "$colorCode" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } },
                  },
                  {
                    $lookup: {
                      from: "FabricType",
                      let: { type_id: "$typeId" },
                      pipeline: [
                        {
                          $match: { $expr: { $eq: ["$_id", "$$type_id"] } },
                        },
                      ],
                      as: "fabricType",
                    },
                  },
                  { $unwind: "$fabricType" },
                  {
                    $group: {
                      _id: "$fabricType.name",
                    },
                  },
                ],
                as: "item",
              },
            },
            { $unwind: "$item" },
          ],
          as: "fabricTypeSell",
        },
      },
      { $unwind: "$fabricTypeSell" },
      {
        $group: {
          _id: "$fabricTypeSell.item._id",
          countFabrictype: { $sum: 1 },
        },
      },
      { $sort: { countFabrictype: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getBillStatus = async (req, res) => {
  try {
    if (req.query.date) {
      selectDate = req.query.date;
      yearSel = Number(selectDate.slice(0, 4));
      monthSel = Number(selectDate.slice(5, 7));
    } else {
      selectDate = new Date();
      monthSel = selectDate.getMonth() + 1;
      yearSel = selectDate.getFullYear();
    }
    const result = await Bill.aggregate([
      { $project: { _id: 1, status: 1, exportBillTime: 1 } },
      { $addFields: { month: { $month: "$exportBillTime" } } },
      { $addFields: { year: { $year: "$exportBillTime" } } },
      { $addFields: { lastStatus: { $last: "$status" } } },
      { $match: { year: yearSel } },
      { $match: { month: monthSel } },
      {
        $group: {
          _id: "$lastStatus.name",
          lastStatusBill: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getBillCompletePicker = async (req, res) => {
  try {
    const datePicker = mongoose.Types.ObjectId(req.params.date);
    const result = await Bill.aggregate([
      { $unwind: "$status" },
      { $match: { "status.name": "completed" } },
      { $addFields: { month: { $month: "$exportBillTime" } } },
      { $addFields: { year: { $year: "$exportBillTime" } } },
      { $match: { year: yearCur } },
      { $match: { month: monthCur } },
      { $project: { _id: 1 } },
      {
        $group: {
          _id: null,
          billcompleted: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      res.status(200).json(0);
    } else {
      result.map((item) => res.status(200).json(item.billcompleted));
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

const updateBillStatus = async (req, res) => {
  try {
    const result = await Bill.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      {
        $push: { status: { name: req.body.name, reason: req.body.reason } },
      }
    );

    const customer = await Customer.aggregate([
      { $match: { _id: result.clientID } },
    ]);
    console.log(customer[0]);
    //send email
    const data = {
      email_type: "bill_status_change",
      email: customer[0].email,
      subject: "Trạng thái đơn hàng thay đổi",
      order_id: "",
      bill_id: result.billID,
      customer_name: customer[0].name,
      order_status: "",
      bill_status: req.body.name,
    };
    mailApi.sendEmail(data);
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getListBill,
  createBill,
  getListBillByOrderId,
  getBillDetail,
  getFabricRollBillCompleted,
  getListBillByIds,
  getBillComplete,
  getBillStatus,
  getBillFabricTypeSell,
  getListBillUncomplete,
  getListBillComplete,
  updateBillStatus,
};
