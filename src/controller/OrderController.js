const { Order } = require("../models/Order");
const { Has } = require("../models/Has");
const { Item } = require("../models/Item");
const { FabricType } = require("../models/FabricType");
const { Counter } = require("../models/Counter");
const mongoose = require("mongoose");
const { Schema } = mongoose;

async function getNextSequenceValue(sequenceName) {
  let seq = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

module.exports = {
  list: (req, res) => {
    Order.find()
      .populate({
        path: "products",
        populate: {
          path: "colorCode",
          populate: {
            path: "typeId",
            select: "name -_id",
          },
          select: "colorCode typeId name -_id",
        },
        select: "colorCode length shippedLength -_id",
      })
      .exec(function (err, result) {
        if (err) res.json(err);
        else res.json(result);
      });
  },
  create: async (req, res) => {
    const id = await getNextSequenceValue("orderId");
    const asyncRes = await Promise.all(req.body.products.map(async (item, idx) => {
      let colorId = await Item.findOne({ colorCode: item }).exec();
      console.log(colorId);
      let a = await Has.create({
        orderId: id,
        colorCode: colorId._id,
        length: 2000,
        shippedLength: 0,
      });
      return a._id;
    }));
    let result = await Order.create({
      orderId: id,
      orderStatus: req.body.orderStatus,
      // orderTime: req.body.orderTime,
      note: req.body.note,
      receiverName: req.body.receiverName,
      receiverPhone: req.body.receiverPhone,
      receiverAddress: req.body.receiverAddress,
      deposit: req.body.deposit,
      clientID: req.body.clientID,
      detailBill: req.body.detailBill,
      products: asyncRes,
    });
    console.log(result);
    res.send(result);
  },
  detail: (req, res) => {
    Order.findOne({ orderId: req.params.id })
      .populate({
        path: "products",
        populate: {
          path: "colorCode",
          populate: {
            path: "typeId",
            select: "name -_id",
          },
          select: "colorCode typeId name -_id",
        },
        select: "colorCode length shippedLength -_id",
      })
      .exec(function (err, result) {
        if (err) res.json(err);
        else res.json(result);
      });
  },

  updateInfo: (req, res) => {
    Order.findOneAndUpdate(
      { orderId: req.body.id },
      {
        note: req.body.note,
        receiverName: req.body.receiverName,
        receiverPhone: req.body.receiverPhone,
        receiverAddress: req.body.receiverAddress,
      },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.json({ message: "Error" });
        } else {
          console.log(result);
          return res.json(result);
        }
      }
    );
  },

  updateStatus: (req, res) => {
    Order.findOneAndUpdate(
      { orderId: req.body.id },
      { status: req.body.status },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.json({ message: "Error" });
        } else {
          console.log(result);
          return res.json(result);
        }
      }
    );
  },
};
