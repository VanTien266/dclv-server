const { FabricRoll } = require("../models/FabricRoll");
//Insert 50 documents of FabricRolls collection
// const colorCodeList=["ffff",];
const lotList = ["L1", "L2", "L3", "L4", "L5", "L6"];
const warehouseList = ["K1", "K2", "K3", "K4", "K5", "K6", "K7"];
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

const colorListCode = [];
for (let i = 0; i < listType.length; i++)
  for (let j = 0; j < listColor.length; j++) {
    colorListCode.push(`${listType[i].id}${listColor[j].code}`);
  }

function InsertToFabricRoll() {
  //FOR CREATE FABRIC ROLL WITH STATUS TRUE
  // for (let i = 0; i < 200; i++)
  //   FabricRoll.create(
  //     {
  //       status: true,
  //       dayApplied: new Date().setDate(Math.floor(Math.random() * 30)), //pick a random day
  //       length: Math.floor(Math.random() * 99 + 1) * 10, //random length from 100-990
  //       lot: lotList[Math.floor(Math.random() * 6)],
  //       warehouseId: warehouseList[Math.floor(Math.random() * 7)],
  //       billId: "",
  //       colorCode:
  //         colorListCode[Math.floor(Math.random() * colorListCode.length)],
  //     },
  //     function (err, data) {
  //       if (err) console.log(err);
  //       else console.log(data);
  //     }
  //   );

  // FOR CREATE FABRIC ROLL WITH STATUS FALSE
  for (let i = 0; i < 200; i++)
    FabricRoll.create(
      {
        status: false,
        dayApplied: new Date().setDate(Math.floor(Math.random() * 30)),
        length: Math.floor(Math.random() * 9 + 1) * 100,
        lot: lotList[Math.floor(Math.random() * 6)],
        warehouseId: warehouseList[Math.floor(Math.random() * 7)],
        billId: Math.floor(Math.random() * 100),
        colorCode:
          colorListCode[Math.floor(Math.random() * colorListCode.length)],
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
}
module.exports = { InsertToFabricRoll };
