const { Customer } = require("../models/Customer");

const telephone = ["0214141424", "0216581432", "0214151429", "0214147426"];
const address = [
  "KTX Khu A, ĐHQG TPHCM",
  "Khu KTX Khu B, ĐHQG TPHCM",
  "268 Lý Thường Kiệt, Quận 10, TPHCM",
];
const name = ["Nguyễn Văn A", "Nguyễn Văn B", "Nguyễn Văn C"];
const email = [
  "nguyenvana@gmail.com",
  "nguyenvanb@gmail.com",
  "nguyenvan@gmail.com",
];

function InsertToCustomer() {
  for (let i = 0; i < 5; i++)
    Customer.create(
      {
        id: new Date().getTime() % 10000,
        name: name[Math.floor(Math.random() * 3)],
        phone: telephone[Math.floor(Math.random() * 4)],
        email: email[Math.floor(Math.random() * 3)],
        birthday: new Date().setDate(Math.floor(Math.random() * 30)), //pick a random day
        password: 123456789,
        address: address[Math.floor(Math.random() * 3)],
        type: true,
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
}
module.exports = { InsertToCustomer };
