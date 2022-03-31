const { Bill } = require("../models/Bill");
const { Order } = require("../models/Order");
const { Staff } = require("../models/Staff");
const { Has } = require("../models/Has");
const { FabricRoll } = require("../models/FabricRoll");
const { Counter } = require("../models/Counter");
const mongoose = require("mongoose");
const qs = require("qs");

const { ValidateOrder } = require("../services/Order/ValidateOrder");

async function getNextSequenceValue(sequenceName) {
  let seq = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

const createBill = async (req, res) => {
  const id = await getNextSequenceValue("billId");
  console.log(req.body);
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
  console.log(listFabricRoll);

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

  ValidateOrder(req.body.orderId);

  console.log(result);
  res.send("Ok");
};

const getListBill = async (req, res) => {
  Bill.find({})
    .populate({ path: "clientID" })
    .populate({ path: "orderID" })
    .exec(function (err, result) {
      if (err) {
        console.log(err);
        return res.json({ message: "Error" });
      } else {
        return res.json(result);
      }
    });
};

const getListBillByIds = async (req, res) => {
  const body = qs.parse(req.body);
  const ids = body.ids || [];
  console.log(body.ids);
  Bill.find({ _id: { $in: ids } })
    .populate({ path: "salesmanID", select: "name" })
    .exec(function (err, result) {
      if (err) res.json(err);
      else res.json(result);
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
  const id = mongoose.Types.ObjectId(req.params.id);
  Bill.findOne({ _id: id })
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
        return res.json(result);
      }
    });
};

const getBillComplete = async (req, res) => {
  try {
    // Bill.find(
    //   { "status.name": "completed" }
    // );
    const result = await Bill.aggregate([
      { $unwind: "$status" },
      // // {$unwind: "$status.name"},
      { $match: { "status.name": "completed" } },
      { $project: { _id: 1 } },
      // { $unwind: "$fabricRoll" },
      {
        $group: {
          _id: null,
          billcompleted: { $sum: 1 },
        },
      },
      // // }}
      // { $count: "fabricRoll" },
    ]);

    console.log("Get Bill Completed successfully");
    console.log(result);
    // res.status(200).json(result);
    {
      result.map((item) => res.status(200).json(item.billcompleted));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
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

// const getFabricTypeSell = (req, res) => {
//   // Order.find()
//   //   .populate({
//   //     path: "products",
//   //     populate: {
//   //       path: "colorCode",
//   //       //   populate: {
//   //       //     path: "typeId",
//   //       //     select: "name -_id",
//   //       //   },
//   //       select: "colorCode typeId name -_id",
//   //     },
//   //     select: "colorCode length shippedLength -_id",
//   //   })
//   //   .populate({
//   //     path: "detailBill",
//   //     // populate: { path: "salesmanID", select: "name -_id" },
//   //   })
//   Bill
//     .find({"status.name": "completed"})
//     .select('fabricRoll')
//     .populate({
//       path:'fabricRoll',
//       select:'colorCode',
//       populate:{
//         path: 'colorCode',
//         // collection: 'Item',
//         //   populate: {
//         //     path: "name",
//         //     // select: "name -_id",
//         //   },
//       },
//     })
//     .exec(function (err, result) {
//       if (err) {
//         console.log(err);
//         res.json(err);
//       }
//       else {
//         console.log("Get Fabric Type Sell Success");
//         console.log(result);
//         res.json(result);
//       }
//     });
// };
const getBillFabricTypeSell = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $project: { _id: 1, exportBillTime: 1, fabricRoll: 1 } },
      { $addFields: { month: { $month: "$exportBillTime" } } },
      { $addFields: { year: { $year: "$exportBillTime" } } },
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

    console.log("Get Bill Fabric Type Sell successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getBillStatus = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      // { $unwind: "$orderStatus" },
      // { $match: { "orderStatus.name": "completed" } },
      // { $project : { _id : 1, status: 1 } },
      // { $lookup : {
      //     from : 'Bill',
      //     localField : 'billStatus',
      //     foreignField : '',
      //     as : 'Bill'
      // } }
      // {
      //   $group: {
      //     _id: "$orderStatus.name",
      //     orderComplete: { $sum: 1 },
      //   },
      // },
      { $project: { _id: 1, status: 1, exportBillTime: 1 } },
      { $addFields: { month: { $month: "$exportBillTime" } } },
      { $addFields: { lastStatus: { $last: "$status" } } },
      // { $addFields: { lastStatus: { $last: "$status" } } },
      { $match: { month: 12 } },
      {
        $group: {
          _id: "$lastStatus.name",
          lastStatusBill: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log("Get Bill Status successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

// const getBillCompleteMonthly = async (req, res) => {
//   try {
//     // Bill.find(
//     //   { "status.name": "completed" }
//     // );
//     const result = await Bill.aggregate([
//       { $unwind: "$status" },
//       // // {$unwind: "$status.name"},
//       { $match: { "status.name": "completed" } },
//       // { $project: { _id: 1 } },
//       // { $unwind: "$fabricRoll" },
//       // {$group: {
//       //   _id: null,
//       //   billcompleted : {$sum: 1}
//       }}
//       // // }}
//       // { $count: "fabricRoll" },
//     ]);

//     console.log("Get Bill Completed successfully");
//     console.log(result);
//     // res.status(200).json(result);
//     {
//       result.map((item) => res.status(200).json(item.billcompleted));
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err });
//   }
// };

module.exports = {
  getListBill,
  createBill,
  getListBillByOrderId,
  getBillDetail,
  getFabricRollBillComplete,
  getListBillByIds,
  getBillComplete,
  getBillStatus,
  getBillFabricTypeSell,
  // getBillCompleteMonthly
};
