const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const qs = require("qs");
var _ = require("lodash");

const { FabricRoll } = require("../models/FabricRoll");
const { FabricType } = require("../models/FabricType");
const { Item } = require("../models/Item");
const { MarketPrice } = require("../models/MarketPrice");

const getProductList1 = async (req, res) => {
  try {
    const products = await FabricType.aggregate([
      {
        $lookup: {
          from: "FabricRoll",
          let: { type_id: "$id" },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: ["$$type_id", { $substr: ["$colorCode", 0, 2] }],
                    },
                  },
                  { $expr: { $eq: ["$status", true] } },
                ],
              },
            },
            {
              $group: {
                _id: "$lot",
                count: { $sum: 1 },
                colorCode: { $first: "$colorCode" },
              },
            },
            {
              $lookup: {
                from: "Item",
                let: { color_code: "$colorCode" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$colorCode", "$$color_code"] } },
                  },
                  {
                    $group: {
                      _id: null,
                      name: { $first: "$name" },
                    },
                  },
                ],
                as: "itemName",
              },
            },
            { $unwind: "$itemName" },
          ],
          as: "fabricRoll",
        },
      },
    ]);
    console.log("Get all Fabric Roll successfully!");

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

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
  console.log(mongoose.Types.ObjectId(req.query.id));
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
    console.log(product);
    console.log("Get Fabric Roll successfully", product);
    res.status(200).json(product[0]);
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

//Get sort list fabric roll with ids
const getFabricRollOfBill = async (req, res) => {
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
    console.log("Get List Fabric Roll of Bill successfully");
    var lastResult = _.mapValues(_.groupBy(result, "colorCode"), (clist) =>
      clist.map((item) => _.omit(item, "colorCode"))
    );
    res.status(200).json(Object.values(lastResult));
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
      { $match: { status: true } },
      {
        $group: {
          _id: "$warehouseId",
          countFabric: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log("Get Chart Warehouse successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

//chưa test xong
const getFabricTypeWarehouse = async (req, res) => {
  try {
    const result = await FabricRoll.aggregate([
      { $project: { warehouseId: 1, status: 1 } },
    ]);
    console.log("Get Fabric Type Warehouse successfully");
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};
const getFullListFabricType = (req, res) => {
  const listType = [
    { id: "co", name: "cotton" },
    { id: "ka", name: "kaki" },
    { id: "je", name: "jeans" },
    { id: "kt", name: "kate" },
    { id: "ni", name: "nỉ" },
    { id: "le", name: "len" },
    { id: "th", name: "thô" },
    { id: "vo", name: "voan" },
    { id: "la", name: "lanh" },
    { id: "du", name: "dũi" },
    { id: "lu", name: "lụa tự nhiên" },
    { id: "re", name: "ren" },
    { id: "nl", name: "ni lông" },
    { id: "tm", name: "tuyết mưa" },
    { id: "ch", name: "chiffon" },
  ];
  return res.status(200).json(listType);
};
const getListColorcode = (req, res) => {
  const listColor = [
    { code: "01", name: "Cam lợt" },
    { code: "02", name: "Bò" },
    { code: "03", name: "Xám lợt" },
    { code: "04", name: "Lục Bình" },
    { code: "05", name: "Đen" },
    { code: "06", name: "Trắng" },
    { code: "07", name: "Cà lợt" },
    { code: "08", name: "Cẩm" },
    { code: "09", name: "Cam ngói" },
    { code: "10", name: "Vàng chanh" },
    { code: "11", name: "Trắng gạo" },
    { code: "12", name: "Cánh sen" },
    { code: "13", name: "Nâu" },
    { code: "14", name: "Ngói" },
    { code: "15", name: "Biển" },
    { code: "16", name: "Tím huế" },
    { code: "17", name: "Bơ" },
    { code: "18", name: "Xanh đen" },
    { code: "19", name: "Hồng phấn" },
    { code: "20", name: "Xám đậm" },
    { code: "21", name: "Cà phê" },
    { code: "22", name: "Hoa đào" },
    { code: "23", name: "Đỏ" },
    { code: "24", name: "Xanh rêu" },
  ];
  return res.status(200).json(listColor);
};

module.exports = {
  getProductList,
  getProductList1,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
  getListFabricRollWithIds,
  getFabricRollOfBill,
  getChartWarehouseTrue,
  getFabricTypeWarehouse,
  getFullListFabricType,
  getListColorcode,
};
