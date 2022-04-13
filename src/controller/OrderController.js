const { Order } = require("../models/Order");
const { Has } = require("../models/Has");
const { Item } = require("../models/Item");
const { FabricType } = require("../models/FabricType");
const { Customer } = require("../models/Customer");
const { Counter } = require("../models/Counter");
const mailApi = require("../utils/axios/mailApi");
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
    try {
      const id = await getNextSequenceValue("orderId");
      const asyncRes = await Promise.all(
        req.body.products.map(async (item, idx) => {
          let colorId = await Item.findOne({
            colorCode: item.colorCode,
          }).exec();
          console.log(colorId);
          let a = await Has.create({
            colorCode: colorId._id,
            length: item.length,
            shippedLength: 0,
          });
          return a._id;
        })
      );
      let result = await Order.create({
        orderId: id,
        orderStatus: [
          {
            name: "pending",
            date: Date.now(),
          },
        ],
        note: req.body.note,
        receiverName: req.body.receiverName,
        receiverPhone: req.body.receiverPhone,
        receiverAddress: req.body.receiverAddress,
        deposit: req.body.deposit,
        clientID: mongoose.Types.ObjectId(req.body.clientID),
        detailBill: [],
        products: asyncRes,
      });
      asyncRes.forEach((item) => {
        Has.findOneAndUpdate({ _id: item }, { orderId: result._id }).exec();
      });
      //Update Has order id

      const customer = await Customer.aggregate([
        { $match: { _id: req.body.clientID } },
      ]);
      const data = {
        email_type: "create_order_success",
        email: customer.email,
        subject: "Đặt hàng thành công",
        order_id: result.orderId,
        bill_id: "",
        customer_name: customer.name,
        order_status: "",
        bill_status: "",
      };
      mailApi.sendEmail(data);
      console.log("Create order successfully!");
      res.send(result);
    } catch (err) {
      console.log(err);
    }
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

  deposit: async (req, res) => {
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
      const depositBillTotal = await Bill.aggregate([
        { $unwind: "$status" },
        { $match: { "status.name": "completed" } },
        { $addFields: { month: { $month: "$status.date" } } },
        { $addFields: { year: { $year: "$status.date" } } },
        { $match: { year: yearSel } },
        { $match: { month: monthSel } },
        {
          $group: {
            _id: null,
            depositBill: { $sum: "$valueBill" },
          },
        },
      ]);
      console.log("depositBillTotal", depositBillTotal);
      let resultBill;
      if (depositBillTotal?.length === 0) resultBill = 0;
      else {
        depositBillTotal.map((item) => (resultBill = item.depositBill));
      }
      console.log("resultBill", resultBill);
      const depositOrderTotal = await Order.aggregate([
        { $project: { _id: 1, orderTime: 1, deposit: 1 } },
        { $addFields: { month: { $month: "$orderTime" } } },
        { $addFields: { year: { $year: "$orderTime" } } },
        { $match: { year: yearSel } },
        { $match: { month: monthSel } },
        {
          $group: {
            _id: null,
            totalDeposit: { $sum: "$deposit" },
          },
        },
      ]);
      console.log("depositOrderTotal", depositOrderTotal);
      let resultOrder;
      if (depositOrderTotal?.length === 0) resultOrder = 0;
      else {
        depositOrderTotal.map((item) => (resultOrder = item.totalDeposit));
      }
      console.log("resultOrder", resultOrder);
      let result;
      result = resultBill + resultOrder;
      if (result === 0) result = "0";
      console.log("Get Total Deposit successfully");
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  getTotalOrderbyMonth: async (req, res) => {
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
      const resultTotalOrder = await Order.aggregate([
        { $project: { _id: 1, orderTime: 1 } },
        { $addFields: { month: { $month: "$orderTime" } } },
        { $addFields: { year: { $year: "$orderTime" } } },
        { $match: { year: yearSel } },
        { $match: { month: monthSel } },
        {
          $group: {
            _id: null,
            monthlyorder: { $sum: 1 },
          },
        },
      ]);
      console.log("Get Total Order By Month successfully");
      console.log(resultTotalOrder);
      let result;
      if (resultTotalOrder?.length === 0) result = "0";
      else {
        resultTotalOrder.map((item) => (result = item.monthlyorder));
      }
      console.log(result);
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
          select: "colorCode typeId name -_id",
        },
        select: "colorCode length shippedLength -_id",
      })
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
      if (req.query.date) {
        selectDate = req.query.date;
        yearSel = Number(selectDate.slice(0, 4));
        monthSel = Number(selectDate.slice(5, 7));
      } else {
        selectDate = new Date();
        monthSel = selectDate.getMonth() + 1;
        yearSel = selectDate.getFullYear();
      }
      const result = await Order.aggregate([
        { $project: { _id: 1, orderTime: 1, orderStatus: 1 } },
        { $addFields: { month: { $month: "$orderTime" } } },
        { $addFields: { year: { $year: "$orderTime" } } },
        { $addFields: { lastStatus: { $last: "$orderStatus" } } },
        { $match: { year: yearSel } },
        { $match: { month: monthSel } },
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
      if (req.query.date) {
        selectDate = req.query.date;
        yearSel = Number(selectDate.slice(0, 4));
        monthSel = Number(selectDate.slice(5, 7));
      } else {
        selectDate = new Date();
        monthSel = selectDate.getMonth() + 1;
        yearSel = selectDate.getFullYear();
      }
      const result = await Order.aggregate([
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
        { $match: { "_id.year": yearSel } },
        { $match: { "_id.month": monthSel } },
        { $sort: { "_id.date": 1 } },
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
      ]);
      console.log("Get Order Fabric Type successfully");
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  getOrderByCustomer: (req, res) => {
    try {
      Order.aggregate(
        [
          {
            $match: {
              clientID: { $eq: mongoose.Types.ObjectId(req.params.id) },
            },
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
            },
          },
        ],
        function (err, data) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          } else {
            console.log(data);
            res.status(200).json(data);
          }
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getOrderbyDateRange: async (req, res) => {
    try {
      if (req.query) {
        from_date = new Date(req.query.from_date);
        to_date = new Date(req.query.to_date);
      } else {
        from_date = new Date();
        to_date = new Date() + 1;
      }
      const result = await Order.aggregate([
        { $match: { orderTime: { $gte: from_date, $lte: to_date } } },
      ]);
      console.log("Get List Order By Date Range successfully");
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
};
