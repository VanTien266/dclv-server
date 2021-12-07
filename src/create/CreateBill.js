const { Bills } = require("../models/Bills");

function InsertToBill() {
    for (let i = 0; i < 10; i++)
        Bills.create(
            {
                billID: i,
                billStatus: "Đang giao hàng",
                exportBillTime: new Date().setDate(Math.floor(Math.random() * 30)), //pick a random day
                address: "268 LTK, P14, Q10, TPHCM",
                valueBill: 20000000,
                clientID: "USR6576",
                shipperID: "IDBH2635",
                orderID: 25,
                salesmanID: "IDBH1111"
            },
            function (err, data) {
                if (err) console.log(err);
                else console.log(data);
            }
        );
}
module.exports = { InsertToBill };
