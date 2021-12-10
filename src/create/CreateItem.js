const { Item } = require("../models/Item");
const _ = require("lodash");
const mongoose = require("mongoose");
const { FabricType } = require("../models/FabricType");
const { MarketPrice } = require("../models/MarketPrice");

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

// const listType = [
//   { id: "co", name: "cotton" },
//   { id: "ka", name: "kaki" },
//   { id: "je", name: "jeans" },
//   { id: "kt", name: "kate" },
//   { id: "ni", name: "nỉ" },
//   { id: "le", name: "len" },
//   { id: "th", name: "thô" },
//   { id: "vo", name: "voan" },
//   { id: "la", name: "lanh" },
//   { id: "du", name: "dũi" },
//   { id: "lu", name: "lụa tự nhiên" },
//   { id: "re", name: "ren" },
//   { id: "nl", name: "ni lông" },
//   { id: "tm", name: "tuyết mưa" },
//   { id: "ch", name: "chiffon" },
// ];

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

module.exports = { InsertToItem };
