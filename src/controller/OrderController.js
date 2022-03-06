const { Order } = require("../models/Order");
const { Has } = require("../models/Has");
const { Item } = require("../models/Item");
const { FabricType } = require("../models/FabricType");
const { Customer } = require("../models/Customer");
const { Counter } = require("../models/Counter");
const mongoose = require("mongoose");
const { Bill } = require("../models/Bill");

async function getNextSequenceValue(sequenceName) {
  let seq = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

module.exports = {
  list: async (req, res) => {
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
        populate: [
          { path: "salesmanID", select: "name -_id" },
          { path: "clientID", select: "name -_id" },
        ],
      })
      .populate({
        path: "clientID",
        select: "name -_id",
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
          date: Date.now(),
        },
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
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
      .populate({
        path: "products",
        populate: {
          path: "colorCode",
          populate: [
            {
              path: "typeId",
              select: "name -_id",
            },
            {
              path: "marketPriceId",
              options: { sort: { dayApplied: "desc" }, limit: 1 },
              select: "price -_id",
            },
          ],
          select: "colorCode typeId name -_id",
        },
        select: "colorCode length shippedLength -_id",
      })
      .populate({
        path: "clientID",
        select: "name email address phone",
      })
      .populate({
        path: "detailBill",
        populate: { path: "salesmanID", select: "name -_id" },
      })
      .exec(function (err, result) {
        if (err) res.json(err);
        else {
          res.json(result);
        }
      });
  },

  getListProductsById: (req, res) => {
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, "products")
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
          return res.json(result);
        }
      }
    );
  },

  updateStatus: async (req, res) => {
    const status = await Order.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      "orderStatus"
    ).exec();
    console.log("Update", status.orderStatus);
    if (status.orderStatus[status.orderStatus.length - 1].name !== "processing")
      Order.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          $push: {
            orderStatus: { name: req.body.status, reason: req.body.reason },
          },
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

  cancleExportBill: async (req, res) => {
    const status = await Order.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      "orderStatus"
    ).exec();
    console.log("Cancle ", status);
    if (status.orderStatus[status.orderStatus.length - 1].name === "processing")
      Order.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          $pop: {
            orderStatus: 1,
          },
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

  countAllOrder: (req, res) => {
    Order.count(function (err, result) {
      if (err) {
        console.log(err);
        return res.json({ message: "Error" });
      } else {
        console.log(result);
        return res.json(result);
      }
    });
  },

  countAllOrderComplete: async (req, res) => {
    // Order.aggregate([
    //   { $match : { "orderStatus.name" : "completed" } },
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
    const query = { "orderStatus.name": "completed" };
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
        { $unwind: "$status" },
        { $match: { "status.name": "completed" } },
        // { $project : { _id : 0, name : 1 } },
        // { $lookup : {
        //     from : 'Bill',
        //     localField : 'billStatus',
        //     foreignField : '',
        //     as : 'Bill'
        // } }
        {
          $group: {
            _id: null,
            depositBill: { $sum: "$valueBill" },
          },
        },
      ]);
      const resultBill = depositBillTotal.map((item) => item.depositBill);
      const depositOrderTotal = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalDeposit: { $sum: "$deposit" },
          },
        },
      ]);
      const resultOrder = depositOrderTotal.map((item) => item.totalDeposit);
      const result = resultBill[0] + resultOrder[0];
      console.log("Get Total Deposit successfully");
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  getOrderbyDateRange: async (req, res) => {
    try {
      // let today = moment().startOf('day');
      // // "2021-12-013T00:00:00.00
      // let tomorrow = moment(today).endOf('day');
      // // "2021-12-13T23:59:59.999

      let from_date = new Date("2021-12-6").toISOString();
      let to_date = new Date("2021-12-8").toISOString();
      const rangeDateOrder = await Order.find({
        orderTime: { $gte: from_date, $lte: to_date },
      }).count();
      // const rangeDateOrder = await Order.aggregate([
      //   {$match: {orderTime: {$gte: from_date, $lte:to_date}}},
      //   // {$count: "countOrder"}
      //   ]
      // );
      console.log("Get Order By Range successfully");
      console.log(rangeDateOrder);
      res.status(200).json(rangeDateOrder);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  getTotalOrderbyMonth: async (req, res) => {
    try {
      const result = await Order.aggregate([
        // { $unwind: "$orderStatus" },
        // { $match: { "orderStatus.name": "completed" } },

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

        { $project: { _id: 1, orderTime: 1 } },
        { $addFields: { month: { $month: "$orderTime" } } },
        // { $group: {
        //     _id: "$lastStatus.name",
        //     lastStatusOrder: { $sum: 1 },
        //   },
        // },
        //đổi month theo dạng input đầu vào
        { $match: { month: 12 } },
        {
          $group: {
            _id: null,
            monthlyorder: { $sum: 1 },
          },
        },
      ]);
      console.log("Get Total Order By Month successfully");
      console.log(result);
      {
        result.map((item) => res.status(200).json(item.monthlyorder));
      }
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  getFabricTypeOrder: (req, res) => {
    Order.find()
      .select("products")
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
      // Bill
      //   .find({"status.name": "completed"})
      //   .select('fabricRoll')
      //   .populate({
      //     path:'fabricRoll',
      //     select:'colorCode',
      //     populate:{
      //       path: 'colorCode',
      //       collection: 'Item',
      //         populate: {
      //           path: "name",
      //           // select: "name -_id",
      //         },
      //     },
      //   })
      .exec(function (err, result) {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          console.log("Get Fabric Type Order Success");
          console.log(result);
          res.json(result);
        }
      });
  },

  getOrderStatus: async (req, res) => {
    try {
      const result = await Order.aggregate([
        // { $unwind: "$orderStatus" },
        // { $match: { "orderStatus.name": "completed" } },
        // { $project : { _id : 1, orderStatus: 1 } },
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
        { $project: { _id: 1, orderTime: 1, orderStatus: 1 } },
        { $addFields: { month: { $month: "$orderTime" } } },
        { $addFields: { lastStatus: { $last: "$orderStatus" } } },
        // { $addFields: { lastStatusMonth: { $month: "$lastStatus.date" } } },
        //đổi lại month khi set date time picker
        { $match: { month: 12 } },
        {
          $group: {
            _id: "$lastStatus.name",
            lastStatusOrder: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      console.log("Get Order Status successfully");
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  //query order hàng tháng (mỗi ngày trong 1 tháng)
  getOrderDaily: async (req, res) => {
    try {
      const result = await Order.aggregate([
        // {$project: { _id: 1, orderTime: 1}},
        // { $addFields: { monthOrder: { $month: "$orderTime" } } },
        // { $addFields: { year: { $year: "$orderTime" } } },
        {
          $group: {
            _id: {
              year: { $year: "$orderTime" },
              month: { $month: "$orderTime" },
              date: { $dayOfMonth: "$orderTime" },
            },
            Total: { $sum: 1 },
          },
        },
        { $match: { "_id.year": 2021 } },
        { $match: { "_id.month": 12 } },
        { $sort: { "_id.date": 1 } },
        // { $addFields: { monthOrder: { $month: "$orderTime" } } },
        // { $addFields: { year: { $year: "$orderTime" } } },
        // { $addFields: { month: { $month: "$_id.month" } } },
      ]);
      console.log("Get Order Monthly successfully");
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  getOrderFabricType: async (req, res) => {
    try {
      const result = await Order.aggregate([
        { $project: { _id: 1, orderTime: 1, products: 1 } },
        { $addFields: { month: { $month: "$orderTime" } } },
        { $addFields: { year: { $year: "$orderTime" } } },
        { $unwind: "$products" },
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
                      $match: {
                        $expr: { $eq: ["$colorCode", "$$color_code"] },
                      },
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
        // { $unwind: "$fabricTypeSell" },
        // {
        //   $group: {
        //     _id: "$fabricTypeSell.item._id",
        //     countFabrictype: { $sum: 1 },
        //   },
        // },
        // { $sort: { countFabrictype: -1 } },
        // { $limit: 5 },
      ]);
      console.log("Get Order Fabric Type successfully");
      console.log(result);
      res.status(200).json(result);
      // {result.map((item) => (
      //   res.status(200).json(item.fabricRoll)
      // ))}
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
};
