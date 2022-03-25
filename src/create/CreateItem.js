const { Item } = require("../models/Item");
const _ = require("lodash");
const mongoose = require("mongoose");
const { FabricType } = require("../models/FabricType");
const { MarketPrice } = require("../models/MarketPrice");

const listColor = [
  { code: "01", name: "Cam lợt", price: 10000 },
  { code: "02", name: "Bò", price: 11000 },
  { code: "03", name: "Xám lợt", price: 12000 },
  { code: "04", name: "Lục Bình", price: 13000 },
  { code: "05", name: "Đen", price: 14000 },
  { code: "06", name: "Trắng", price: 15000 },
  { code: "07", name: "Cà lợt", price: 16000 },
  { code: "08", name: "Cẩm", price: 17000 },
  { code: "09", name: "Cam ngói", price: 18000 },
  { code: "10", name: "Vàng chanh", price: 19000 },
  { code: "11", name: "Trắng gạo", price: 20000 },
  { code: "12", name: "Cánh sen", price: 21000 },
  { code: "13", name: "Nâu", price: 22000 },
  { code: "14", name: "Ngói", price: 23000 },
  { code: "15", name: "Biển", price: 24000 },
  { code: "16", name: "Tím huế", price: 25000 },
  { code: "17", name: "Bơ", price: 26000 },
  { code: "18", name: "Xanh đen", price: 27000 },
  { code: "19", name: "Hồng phấn", price: 28000 },
  { code: "20", name: "Xám đậm", price: 29000 },
  { code: "21", name: "Cà phê", price: 30000 },
  { code: "22", name: "Hoa đào", price: 31000 },
  { code: "23", name: "Đỏ", price: 32000 },
  { code: "24", name: "Xanh rêu", price: 33000 },
];

const listType = [
  { id: "co", name: "cotton", price: 40000, avgLength: 120, error: 40 },
  { id: "ka", name: "kaki", price: 50000, avgLength: 150, error: 50 },
  { id: "je", name: "jeans", price: 60000, avgLength: 180, error: 30 },
  { id: "kt", name: "kate", price: 65000, avgLength: 175, error: 30 },
  { id: "ni", name: "nỉ", price: 45000, avgLength: 135, error: 20 },
  { id: "le", name: "len", price: 70000, avgLength: 210, error: 30 },
  { id: "th", name: "thô", price: 35000, avgLength: 105, error: 25 },
  { id: "vo", name: "voan", price: 55000, avgLength: 165, error: 25 },
  { id: "la", name: "lanh", price: 40000, avgLength: 120, error: 20 },
  { id: "du", name: "dũi", price: 63000, avgLength: 190, error: 30 },
  { id: "lu", name: "lụa tự nhiên", price: 80000, avgLength: 240, error: 30 },
  { id: "re", name: "ren", price: 75000, avgLength: 225, error: 35 },
  { id: "nl", name: "ni lông", price: 67000, avgLength: 120, error: 25 },
  { id: "tm", name: "tuyết mưa", price: 46000, avgLength: 135, error: 30 },
  { id: "ch", name: "chiffon", price: 53000, avgLength: 150, error: 20 },
];

async function getListFabricType() {
  let result = await FabricType.find({}).exec();
  return result;
}

async function getMarketPriceList() {
  let result = await MarketPrice.find({}).exec();
  return result;
}

async function InsertToItem() {
  const listFabricType = await getListFabricType();
  const listMarketPrice = await getMarketPriceList();

  for (let i = 0; i < listColor.length; i++)
    for (let j = 0; j < listFabricType.length; j++) {
      Item.create(
        {
          colorCode: listFabricType[j].id + listColor[i].code,
          typeId: listFabricType[j]._id,
          marketPriceId: [
            listMarketPrice[Math.floor(Math.random() * 7)],
            listMarketPrice[Math.floor(Math.random() * 7)],
          ],
          name:
            _.capitalize(listFabricType[j].name) +
            " " +
            _.capitalize(listColor[i].name),
        },
        function (err, data) {
          if (err) console.log(err);
          else {
            console.log(data);
          }
        }
      );
    }
}

function UpdateItem() {
  const listPrice = [];

  for (let i = 0; i < listType.length; i++) {
    for (let j = 0; j < listColor.length; j++) {
      const item = listType[i].id + listColor[j].code;
      listPrice.push({
        item: item,
        price: listType[i].price + listColor[j].price,
        avgLength:
          listType[i].avgLength + Math.floor(Math.random() * listType[i].error),
      });
    }
  }

  //create market price and add update item
  for (let i = 0; i < listPrice.length; i++) {
    try {
      //create new Market Price
      const newMarketPrice = new MarketPrice({
        dayApplied: Date.now(),
        price: listPrice[i].price,
      });

      newMarketPrice.save(function (err) {
        if (!err) console.log(newMarketPrice);
        else console.log(err);
      });

      // console.log(newMarketPrice._id);
      Item.findOneAndUpdate(
        { colorCode: listPrice[i].item },
        {
          $push: { marketPriceId: newMarketPrice._id },
        },
        function (err, data) {
          if (!err) console.log("Update Market Price successfully!");
          else console.log(err);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { InsertToItem, UpdateItem };
