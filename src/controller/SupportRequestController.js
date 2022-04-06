const mongoose = require("mongoose");
const { SupportRequest } = require("../models/SupportRequest");
const { Counter } = require("../models/Counter");

async function getNextSequenceValue(sequenceName) {
  let seq = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

module.exports = {
  createSupport: async (req, res) => {
    const supportId = await getNextSequenceValue("supportId");
    try {
      SupportRequest.create(
        {
          supportId: supportId,
          status: false,
          request: req.body.content,
          orderId: req.body.orderId,
          salesmanId: req.body.salesmanId,
          customerId: req.body.customerId,
        },
        function (err, data) {
          if (err) res.status(500).json(err);
          else res.status(200).json(data);
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  },
  responseRequest: async (req, res) => {
    try {
      SupportRequest.findByIdAndUpdate(
        { _id: req.body._id },
        { status: true, response: req.body.content, responseTime: Date.now() },
        function (err, data) {
          if (err) {
            res.status(500).json(err);
          } else res.status(200).json(data);
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllRequest: async (req, res) => {
    try {
      SupportRequest.aggregate(
        [
          { $match: { _id: { $exists: true } } },
          {
            $lookup: {
              from: "Customer",
              localField: "customerId",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, name: 1, phone: 1 } }],
              as: "customer",
            },
          },
          { $unwind: "$customer" },
          {
            $lookup: {
              from: "Staff",
              localField: "salesmanId",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, name: 1 } }],
              as: "salesman",
            },
          },
          { $unwind: "$salesman" },
          {
            $lookup: {
              from: "Order",
              localField: "orderId",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, orderId: 1 } }],
              as: "order",
            },
          },
          { $unwind: "$order" },
          {
            $project: {
              _id: 1,
              status: 1,
              request: 1,
              response: 1,
              requestTime: 1,
              responseTime: 1,
              supportId: 1,
              order: 1,
              customer: 1,
              salesman: 1,
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
      console.log(error);
      res.status(500).json(error);
    }
  },
};
