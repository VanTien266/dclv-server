const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const { FabricRoll } = require("../models/FabricRoll");

//Get all product in db
const getProductList = async (req, res) => {
  try {
    const product = await FabricRoll.aggregate([
      // { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "Item",
          let: { color_code: "$colorCode" },
          pipeline: [
            { $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } } },
            {
              $lookup: {
                from: "MarketPrice",
                let: { market_price_id: "$marketPriceId" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$_id", "$$market_price_id"] } },
                  },
                ],
                as: "marketPrice",
              },
            },
            { $unwind: "$marketPrice" },
            {
              $lookup: {
                from: "FabricType",
                let: { type_id: "$typeId" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$id", "$$type_id"] } },
                  },
                ],
                as: "fabricType",
              },
            },
            { $unwind: "$fabricType" },
          ],
          as: "item",
        },
      },
      { $unwind: "$item" },
    ]);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ err });
  }
};

//Get specific product with its id
const getProductById = async (req, res) => {
  try {
    const product = await FabricRoll.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "Item",
          let: { color_code: "$colorCode" }, //assign colorCode in FabricRoll to color_code var
          pipeline: [
            { $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } } }, //colorCode in Item===color_code in FabricRoll
            { $unwind: "$marketPriceId" },
            {
              $lookup: {
                from: "MarketPrice",
                let: { market_price_id: "$marketPriceId" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$_id", "$$market_price_id"] } },
                  },
                  {
                    $group: {
                      _id: "$_id",
                      marketPriceId: { $push: "$marketPriceId" },
                    },
                  },
                ],
                as: "marketPrice",
              },
            },

            // { $group: { _id: "$marketPriceId" } },
            { $unwind: "$marketPrice" },
            {
              $lookup: {
                from: "FabricType",
                let: { type_id: "$typeId" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$id", "$$type_id"] } },
                  },
                ],
                as: "fabricType",
              },
            },
            { $unwind: "$fabricType" },
          ],
          as: "colorCode",
        },
      },
      { $unwind: "$colorCode" },
    ]);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ err });
  }
};

//Update product
const updateProductStatus = async (req, res) => {
  try {
    const body = req.body;
    const id = mongoose.Types.ObjectId(req.params.id);

    FabricRoll.findOneAndUpdate({ _id: id }, body, function (err, data) {
      if (!err) res.status(200).json("Update successfully!");
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};

//Update market price
// const updateMarketPrice = async (req, res) => {
//   try {
//     const body = req.body;
//     const id = mongoose.params.id;

//     Item;
//   } catch (err) {}
// };

module.exports = { getProductList, getProductById, updateProductStatus };
