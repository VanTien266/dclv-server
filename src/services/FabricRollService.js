const { FabricRoll } = require("../models/FabricRoll");

async function getListFabricRollUsedId() {
  const result = await FabricRoll.find({ status: false })
    .distinct("_id")
    .exec();
  return result;
}

async function getOneProduct(id) {
  const result = await FabricRoll.aggregate([
    { $match: { _id: id } },
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
  return result[0];
}

async function getListDistinctColorCode() {
  const listColorCode = await FabricRoll.find().distinct("colorCode").exec();
  return listColorCode;
}
module.exports = {
  getListFabricRollUsedId,
  getOneProduct,
  getListDistinctColorCode,
};
