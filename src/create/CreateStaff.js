const { getMaxListeners } = require("npm");
const { Staff } = require("../models/Staff");

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
const gender = ["Nam", "Nữ"];
const role = ["Nhân viên bán hàng", "Nhân viên giao hàng"];
function InsertToStaff() {
  Staff.create(
    {
      id: new Date().getTime() % 10000,
      name: name[Math.floor(Math.random() * 3)],
      phone: telephone[Math.floor(Math.random() * 4)],
      email: "tien@gmail.com",
      birthday: new Date().setDate(Math.floor(Math.random() * 30)), //pick a random day
      password: 123456789,
      address: address[Math.floor(Math.random() * 3)],
      gender: gender[Math.floor(Math.random() * 2)],
      role: role[Math.floor(Math.random() * 2)],
    },
    function (err, data) {
      if (err) console.log(err);
      else console.log(data);
    }
  );
}
module.exports = { InsertToStaff };
