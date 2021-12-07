const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const { Orders } = require("../models/Orders");

const getListProduct = async (req, res) => {
  try {
    const bills = await Orders.aggregate([
      { $unwind: "$products" },
      { $unwind: "$detailBill" },
      {
        $lookup: {
          from: "Has",
          let: { products: "$products" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$products"] } } }],
          as: "has",
        },
      },
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          orderStatus: { $first: "$orderStatus" },
          note: { $first: "$note" },
          orderTime: { $first: "$orderTime" },
          receiverName: { $first: "$receiverName" },
          receiverPhone: { $first: "$receiverPhone" },
          receiverAddress: { $first: "$receiverAddress" },
          deposit: { $first: "$deposit" },
          clientID: { $first: "$clientID" },
          detailBill: { $push: "$detailBill" },
          has: { $push: "$has" },
        },
      },
    ]);
    res.status(200).json(bills);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { getListProduct };
