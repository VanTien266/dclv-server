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
  const listFabricRoll = await Promise.all(
    req.body.fabricRoll.map(async (item, idx) => {
      let fabricRollId = await FabricRoll.findOneAndUpdate(
        { _id: item },
        { status: false }
      );
      return fabricRollId;
    })
  );
  console.log(listFabricRoll);
  const hasList = await Has.find({
    orderId: mongoose.Types.ObjectId(req.body.orderID),
  })
    .populate("colorCode", "colorCode -_id")
    .exec();
  console.log(hasList);
  const hasUpdate = await Promise.all(
    listFabricRoll.map(async (item, idx) => {
      for (let i = 0; i < hasList.length; i++) {
        if (item.colorCode === hasList[i].colorCode.colorCode) {
          const changeShippedLength = await Has.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(hasList[i]._id) },
            { $inc: { shippedLength: item.length } }
          );
          console.log(changeShippedLength);
          return 1;
        }
      }
      return 0;
    })
  );
  const billObjId = new mongoose.Types.ObjectId();
  await Order.findOneAndUpdate(
    { _id: req.body.orderID },
    { $push: { detailBill: billObjId } }
  );
  let result = await Bill.create({
    _id: billObjId,
    billID: id,
    valueBill: 0,
    orderID: mongoose.Types.ObjectId(req.body.orderID),
    clientID: req.body.clientID,
    salesmanID: mongoose.Types.ObjectId("61b1d9600f59311316f228ea"),
    fabricRoll: req.body.fabricRoll,
    note: req.body.note,
    status: [
      {
        name: "exported",
        date: Date.now(),
        reason: "",
      },
    ],
  });

  ValidateOrder(req.body.orderID);

  console.log(result);
  res.send(result);
};

const getListBill = async (req, res) => {
  //   Bill.find({}, function (err, result) {
  //     if (err) {
  //       console.log(err);
  //       return res.json({ message: "Error" });
  //     } else {
  //       return res.json(result);
  //     }
  //   });
  //aggregate bo qua nhung key trong
  try {
    const result = await Bill.aggregate([{ $match: {} }]);
    console.log("Get Bill Completed successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getListBillByIds = async (req, res) => {
  // const body = qs.parse(req.body);
  // const ids = body.ids || [];
  // console.log(body.ids);
  // Bill.find({ _id: { $in: ids } })
  //   .populate({ path: "salesmanID", select: "name" })
  //   .exec(function (err, result) {
  //     if (err) res.json(err);
  //     else res.json(result);
  //   });
  try {
    const body = qs.parse(req.body);
    const ids = body.ids || [];
    const result = await Bill.aggregate([{ $match: { _id: ids } }]);
    console.log("Get Bill By Ids Completed successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getListBillByOrderId = async (req, res) => {
  // const _id = mongoose.Types.ObjectId(req.params.orderid);
  // Bill.find({ orderID: _id }).exec(function (err, result) {
  //   if (err) {
  //     console.log(err);
  //     res.json(err);
  //   } else {
  //     console.log(`Get list bill of ${_id} success!`);
  //     res.json(result);
  //   }
  // });
  try {
    const id = mongoose.Types.ObjectId(req.params.orderid);
    const result = await Bill.aggregate([{ $match: { orderID: id } }]);
    console.log("Get Bill By Order Id Completed successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getBillDetail = async (req, res) => {
  // const id = mongoose.Types.ObjectId(req.params.id);
  // Bill.findOne({ _id: id })
  // 	.populate({ path: "clientID", select: "name email phone address" })
  // 	.populate({ path: "salesmanID", select: "name phone" })
  // 	.populate({ path: "shipperID", select: "name phone" })
  // 	.populate({
  // 	path: "orderID",
  // 	select: "receiverName receiverPhone receiverAddress",
  // 	})
  // 	.exec(function (err, result) {
  // 	if (err) {
  // 		console.log(err);
  // 		return res.json(err);
  // 	} else {
  // 		return res.json(result);
  // 	}
  // 	});
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
    ]);
    console.log("Get Bill Detail successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
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
    const result = await Bill.aggregate([
      { $unwind: "$status" },
      { $match: { "status.name": "completed" } },
      { $addFields: { month: { $month: "$status.date" } } },
      { $addFields: { year: { $year: "$status.date" } } },
      { $match: { "year": yearSel } },
      { $match: { "month": monthSel } },
      { $project: { _id: 1 } },
      {
        $group: {
          _id: null,
          billcompleted: { $sum: 1 },
        },
      },
    ]);

    console.log("Get Bill Completed successfully");
    console.log(result);
    if (result.length === 0) {
      res.status(200).json(0);
    }
    // res.status(200).json(result);
    else {
      result.map((item) => res.status(200).json(item.billcompleted));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getFabricRollBillComplete = async (req, res) => {

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
      { $unwind: "$status" },
      { $match: { "status.name": "completed" } },
      { $addFields: { month: { $month: "$status.date" } } },
      { $addFields: { year: { $year: "$status.date" } } },
      { $match: { "year": yearSel } },
      { $match: { "month": monthSel } },
      { $project: { fabricRoll: 1 } },
      { $unwind: "$fabricRoll" },
      { $count: "fabricRoll" },
    ]);

    console.log("Get Total Fabric Roll Bill Completed successfully");
    console.log(result);
    // res.status(200).json(result);
    if (result.length == 0) res.status(200).json(0);
    else {
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
      { $match: { "year": yearSel } },
      { $match: { "month": monthSel } },
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
      // {$unwind: "$status"},
      // {$unwind: "$status.name"},
      // {$match: {"status.name": "completed"}},
      // {$project: {fabricRoll: 1}},
      // {$unwind: "$fabricRoll"},
      // {$group: {
      //   _id: null,
      //   totalFabric : {$sum: 1}
      // }}
      // }}
      // { $count: "fabricRoll" }
    ]);

    console.log("Get Bill Fabric Type Sell successfully");
    console.log(result);
    res.status(200).json(result);
    // {result.map((item) => (
    //   res.status(200).json(item.fabricRoll)
    // ))}
  } catch (err) {
    console.log(err);
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
      { $addFields: { year: { $year: "$exportBillTime" } } },
      { $addFields: { lastStatus: { $last: "$status" } } },
      { $match: { "year": yearSel } },
      { $match: { "month": monthSel } },
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

const getBillCompletePicker = async (req, res) => {
  try {
    const datePicker = mongoose.Types.ObjectId(req.params.date);
    // const today = new Date();
    // const monthCur = today.getMonth() + 1;
    // const yearCur = today.getFullYear();
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

    console.log("Get Bill Completed successfully");
    console.log(result);
    if (result.length === 0) {
      res.status(200).json(0);
    }
    // res.status(200).json(result);
    else {
      result.map((item) => res.status(200).json(item.billcompleted));
    }
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
  getBillCompletePicker,
  // getBillCompleteMonthly
};
