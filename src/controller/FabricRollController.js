const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const qs = require("qs");

const { FabricRoll } = require("../models/FabricRoll");
const { Item } = require("../models/Item");
const { MarketPrice } = require("../models/MarketPrice");

//Get all product in db
const getProductList = async (req, res) => {
  try {
    const products = await FabricRoll.aggregate([
      {
        $lookup: {
          from: "Item",
          let: { color_code: "$colorCode" },
          pipeline: [
            { $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } } },
            { $unwind: { path: "$marketPriceId" } },
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
                    $match: { $expr: { $eq: ["$_id", "$$type_id"] } },
                  },
                ],
                as: "fabricType",
              },
            },
            { $unwind: "$fabricType" },
            {
              $group: {
                _id: "$_id",
                colorCode: { $first: "$colorCode" },
                name: { $first: "$name" },
                marketPrice: { $push: "$marketPrice" },
                fabricType: { $first: "$fabricType" },
              },
            },
          ],
          as: "item",
        },
      },
      { $unwind: "$item" },
    ]);
    console.log("Get all Fabric Roll successfully!");
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

//Get specific product with its id
const getProductById = async (req, res) => {
  try {
    const product = await FabricRoll.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
      {
        $lookup: {
          from: "Item",
          let: { color_code: "$colorCode" },
          pipeline: [
            { $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } } },
            { $unwind: { path: "$marketPriceId" } },
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
                    $match: { $expr: { $eq: ["$_id", "$$type_id"] } },
                  },
                ],
                as: "fabricType",
              },
            },
            { $unwind: "$fabricType" },
            {
              $group: {
                _id: "$_id",
                colorCode: { $first: "$colorCode" },
                name: { $first: "$name" },
                marketPrice: { $push: "$marketPrice" },
                fabricType: { $first: "$fabricType" },
              },
            },
          ],
          as: "item",
        },
      },
      { $unwind: "$item" },
    ]);
    console.log("Get Fabric Roll successfully");
    if (product.length > 0) res.status(200).json(product[0]);
    elseres.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get list fabric with ids
const getListFabricRollWithIds = async (req, res) => {
  const body = qs.parse(req.body);
  const ids = body.ids || [];
  ids.forEach((item) => ids.push(mongoose.Types.ObjectId(item)));
  try {
    const result = await FabricRoll.aggregate([
      { $match: { _id: { $in: ids } } },
      {
        $lookup: {
          from: "Item",
          let: { color_code: "$colorCode" },
          pipeline: [
            { $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } } },
            { $unwind: { path: "$marketPriceId" } },
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
                    $match: { $expr: { $eq: ["$_id", "$$type_id"] } },
                  },
                ],
                as: "fabricType",
              },
            },
            { $unwind: "$fabricType" },
            {
              $group: {
                _id: "$_id",
                colorCode: { $first: "$colorCode" },
                name: { $first: "$name" },
                marketPrice: { $push: "$marketPrice" },
                fabricType: { $first: "$fabricType" },
              },
            },
          ],
          as: "item",
        },
      },
      { $unwind: "$item" },
    ]);
    console.log("Get List Fabric Roll successfully");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Update product status
const updateProductStatus = async (req, res) => {
  try {
    const body = req.body;
    const id = mongoose.Types.ObjectId(req.params.id);

    FabricRoll.findOneAndUpdate({ _id: id }, body, function (err, data) {
      if (!err) res.status(200).json("Update Status successfully!");
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};

// Update market price
const updateMarketPrice = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    console.log(id, body);

    const newMarketPrice = new MarketPrice({
      dayApplied: Date.now(),
      price: body.price,
    });

    newMarketPrice.save(function (err) {
      if (!err) console.log(newMarketPrice);
      else console.log(err);
    });
    Item.findByIdAndUpdate(
      { _id: id },
      {
        $push: { marketPriceId: newMarketPrice._id },
      },
      function (err, data) {
        if (!err) res.status(200).json("Update Market Price successfully!");
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};
const getChartWarehouseTrue = async (req, res) => {
  try {
    const result = await FabricRoll.aggregate([
      // {$unwind: "$status"},
      // // {$unwind: "$status.name"},
      { $match: { status: true } },
      // {$project: {status: 1}},
      // {$unwind: "$fabricRoll"},
      {
        $group: {
          _id: "$warehouseId",
          countFabric: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      // }}
      // { $count: "warehouseId" }
    ]);
    console.log("Get Chart Warehouse successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getFabricTypeSell = async (req, res) => {
  try {
    const result = await FabricRoll.aggregate([
      // {$unwind: "$status"},
      // // {$unwind: "$status.name"},
      { $match: { status: false } },
      { $project: { colorCode: 1 } },
      // {$unwind: "$fabricRoll"},
      // {$group: {
      //   _id: "$warehouseId",
      //   countFabric : {$sum: 1},
      // }},
      // {$sort: {_id:1}},
      // }}
      // { $count: "colorCode" }
      {
        $lookup: {
          from: "Item",
          let: { color_code: "$colorCode" },
          pipeline: [
            { $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } } },
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
      {
        $group: {
          _id: "$item._id",
          countFabrictype: { $sum: 1 },
        },
      },
      { $sort: { countFabrictype: -1 } },
      { $limit: 8 },
    ]);
    console.log("Get Fabric Type Sell successfully");
    // console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

module.exports = {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
  getListFabricRollWithIds,
  getChartWarehouseTrue,
  getFabricTypeSell,
};
