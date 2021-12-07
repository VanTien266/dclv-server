const { Has } = require("../models/Has");

function InsertToHas() {
  //FOR CREATE FABRIC ROLL WITH STATUS TRUE
  let product = ["le01", "nl01", "kt02", "ch01", "le02"];
  for (let i = 0; i < 5; i++)
    Has.create(
      {
        orderID: 1,
        colorCode: product[i],
        length: 1000,
        shippedLength: 0
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
}
module.exports = { InsertToHas };
