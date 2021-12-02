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

const { FabricType } = require("../models/FabricType");
//Insert 50 documents of FabricRolls collection

function InsertToFabricType() {
  listType.forEach((item) => {
    FabricType.create(
      {
        id: item.id,
        name: item.name,
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  });
}
module.exports = { InsertToFabricType };
