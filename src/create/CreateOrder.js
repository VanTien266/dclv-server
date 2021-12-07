const { Orders } = require("../models/Orders");

function InsertToOrder() {
  //FOR CREATE FABRIC ROLL WITH STATUS TRUE
  for (let i = 25; i < 36; i++)
    Orders.create(
      {
        orderId: i,
        orderStatus: "Chờ xử lý",
        note: "",
        orderTime: new Date().setDate(Math.floor(Math.random() * 30)), //pick a random day
        receiverName: 20000000,
        receiverPhone: "0987654321",
        receiverAddress: "268 LTK, P14, Q10, TPHCM",
        deposit: 2000000,
        clientID: "USR6576",
        detailBill: "",
        products: []
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
}
module.exports = { InsertToOrder };
