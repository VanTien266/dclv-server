const { Order } = require("../models/Order");
const { Has } = require("../models/Has");
const { Item } = require("../models/Item");
const { FabricType } = require("../models/FabricType");
const { Customer } = require("../models/Customer");
const { Counter } = require("../models/Counter");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const {Bill} = require("../models/Bill");

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
          //   populate: {
          //     path: "typeId",
          //     select: "name -_id",
          //   },
          select: "colorCode typeId name -_id",
        },
        select: "colorCode length shippedLength -_id",
      })
      .populate({
        path: "detailBill",
        // populate: { path: "salesmanID", select: "name -_id" },
      })
      .populate({
        path: "clientID",
        select: "name -_id"
      })
      .exec(function (err, result) {
        if (err) res.json(err);
        else res.json(result);
      });
  },
  create: async (req, res) => {
    const id = await getNextSequenceValue("orderId");
    const asyncRes = await Promise.all(
      req.body.products.map(async (item, idx) => {
        let colorId = await Item.findOne({ colorCode: item }).exec();
        console.log(colorId);
        let a = await Has.create({
          orderId: id,
          colorCode: colorId._id,
          length: 2000,
          shippedLength: 0,
        });
        return a._id;
      })
    );
    let result = await Order.create({
      orderId: id,
      orderStatus: [
		{
			name: req.body.orderStatus,
			date: Date.now()
		}
	  ],
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
    console.log(req.params.id);
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
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
	  .populate({
		  path: "clientID",
		  select: "name email address phone -_id"
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

  countAllOrder: (req, res) => {
    Order.count(
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

  countAllOrderComplete: async (req, res) => {
    // Order.aggregate([
    //   { $match : { orderStatus : "Chờ xử lý" } },
    //   { $count: "total"},
    // ],
    //   function (err, result) {
    //     if (err) {
    //       console.log(err);
    //       return res.json({ message: "Error" });
    //     } else {
    //       console.log(result);
    //       return res.json(result);
    //     }
    //   }
    // );
    const query = {orderStatus : "Chờ xử lý"};
    try {
      const countship = await Order.countDocuments(query);
      console.log(countship);
      return res.json(countship);
    } catch {
      console.log(err);
      return res.json({ message: "Error" });
    }
    
  },

  countAllOrderByDate: (req, res) => {
    // db.orders.countDocuments( { ord_dt: { $gt: new Date('01/01/2012') } }, { limit: 100 } )
  },

  // deposit: (req, res) => {
  //   Order.aggregate(
  //     [
  //         {
  //             $group : {
  //                 _id : null,
  //                 totalDeposit: { $sum: "$deposit" }
  //             }
  //         }
  //     ]
  // ).exec(function (err, result) {
  //   if (err) res.json(err);
  //   // else res.json(result);
  //   else {
  //     result.map((item) => (
  //       res.json(item.totalDeposit)
  //     ))
  //   }
  // });
  // },

  deposit: async (req, res) => {
    try {
      const depositBillTotal = await Bill.aggregate([
        {$unwind: "$status"},
        { $match : { "status.name" : "completed" } },
        // { $project : { _id : 0, name : 1 } },
        // { $lookup : {
        //     from : 'Bill',
        //     localField : 'billStatus',
        //     foreignField : '',
        //     as : 'Bill'
        // } }
        {$group: {
          _id: null,
          depositBill: {$sum: "$valueBill"}
        }}
      ]);
      const resultBill = depositBillTotal.map((item) => (item.depositBill));
      const depositOrderTotal = await Order.aggregate(
        [
            {
                $group : {
                    _id : null,
                    totalDeposit: { $sum: "$deposit" }
                }
            }
        ]);
        const resultOrder = depositOrderTotal.map((item) => (item.totalDeposit));
        const result = resultBill[0] + resultOrder[0];
    console.log("Get Total Deposit successfully");
    console.log(result);
    res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
};
