const { Bills } = require("../models/Bills");
const mongoose = require("mongoose");

const listBillStatus = ["exported", "shipping", "completed", "failed"];
const listOrderId = [];

function InsertToBill() {
  for (let i = 0; i <= 30; i++)
    Bills.create(
      {
        billID: i + 1,
        billStatus: listBillStatus[Math.floor(Math.random() * 4)],
        exportBillTime: Date.now(),
        address: "268 LTK, P14, Q10, TPHCM",
        valueBill: 20000000,
        clientID: "USR6576",
        shipperID: "IDBH2635",
        orderID: 25,
        salesmanID: "IDBH1111",
        fabrics: [
          mongoose.Types.ObjectId("61a8fe7f6d8debe25d1d9206"),
          mongoose.Types.ObjectId("61a8fe7f6d8debe25d1d9208"),
          mongoose.Types.ObjectId("61a8fe7f6d8debe25d1d920c"),
          mongoose.Types.ObjectId("61a8fe7f6d8debe25d1d920b"),
        ],
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
}
module.exports = { InsertToBill };
