const { Bill } = require("../models/Bill");
const { Staff } = require("../models/Staff");
const { Counter } = require("../models/Counter");
const mongoose = require("mongoose");

async function getNextSequenceValue(sequenceName) {
  let seq = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

const getListBill = async (req, res) => {
  Bill.find({}, function (err, result) {
    if (err) {
      console.log(err);
      return res.json({ message: "Error" });
    } else {
      console.log(result);
      return res.json(result);
    }
  });
};

const getListBillByOrderId = async (req, res) => {
  const _id = mongoose.Types.ObjectId(req.params.id);
  Bill.find({ orderID: _id }).exec(function (err, result) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(`Get list bill of ${_id} success!`);
      res.json(result);
    }
  });
};

const getBillDetail = async (req, res) => {
  const _id = mongoose.Types.ObjectId(req.query._id);
  Bill.findOne({ _id: _id })
    .populate({ path: "clientID", select: "name email phone address" })
    .populate({ path: "salesmanID", select: "name phone" })
    .populate({ path: "shipperID", select: "name phone" })
    .populate({
      path: "orderID",
      select: "receiverName receiverPhone receiverAddress",
    })
    .exec(function (err, result) {
      if (err) {
        console.log(err);
        return res.json(err);
      } else {
        console.log(result);
        return res.json(result);
      }
    });
};

const getFabricRollBillComplete = async (req, res) => {
  try {
    // Bill.find(
    //   { "status.name": "completed" }
    // );
    const result = await Bill.aggregate([
      { $unwind: "$status" },
      // // {$unwind: "$status.name"},
      { $match: { "status.name": "completed" } },
      { $project: { fabricRoll: 1 } },
      { $unwind: "$fabricRoll" },
      // {$group: {
      //   _id: null,
      //   totalFabric : {$sum: 1}
      // }}
      // }}
      { $count: "fabricRoll" },
    ]);

    console.log("Get Total Fabric Roll Bill Completed successfully");
    console.log(result);
    // res.status(200).json(result);
    {
      result.map((item) => res.status(200).json(item.fabricRoll));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

module.exports = {
  getListBill,
  getListBillByOrderId,
  getBillDetail,
  getFabricRollBillComplete,
};
