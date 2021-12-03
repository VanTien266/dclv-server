const { Orders } = require("../models/Orders");

function InsertToOrder() {
  //FOR CREATE FABRIC ROLL WITH STATUS TRUE
  for (let i = 0; i < 2; i++)
    Orders.create(
      {
        id: "MDH" + new Date().getTime() % 10000,
        status: "Chờ xử lý",
        orderTime: new Date().setDate(Math.floor(Math.random() * 30)), //pick a random day
        address: "268 LTK, P14, Q10, TPHCM",
        deposit: 20000000,
        clientID: "USR2365"
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
}
module.exports = { InsertToOrder };
