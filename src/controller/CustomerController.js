const { Customer } = require("../models/Customer");
const {
  registerValidationCustomer,
  loginValidation,
} = require("../auth/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createNewCustomer = async (req, res) => {
  // Validate user
  const { error } = registerValidationCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email có tồn tại hay không
  const emailExist = await Customer.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email đã tồn tại");

  // Kiểm tra số điện thoại có tồn tại hay không
  const phoneExist = await Customer.findOne({ phone: req.body.phone });
  if (phoneExist) return res.status(400).send("Số điện thoại đã tồn tại");

  // Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  const newCustomer = new Customer();
  newStaff.id = "KH" + (new Date().getTime() % 10000);
  newCustomer.name = req.body.name;
  newCustomer.email = req.body.email;
  newCustomer.password = hashPass;
  newCustomer.phone = req.body.phone;
  newCustomer.address = req.body.address;
  newCustomer.birthday = req.body.birthday;
  newCustomer.type = true;
  try {
    const Customer = await newCustomer.save();
    res.send(Customer);
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  // Validate user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email
  const userLogin = await Customer.findOne({ email: req.body.email });
  if (!userLogin) return res.status(400).send("Không tìm thấy email");

  // Kiểm tra password
  const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
  if (!passLogin) return res.status(400).send("Mật khẩu không hợp lệ");

  // Ký và tạo token
  const token = jwt.sign({ _id: userLogin._id }, process.env.SECRET_TOKEN);
  res.header("auth-token", token).send({ ...userLogin._doc, jwt: token });
};
const updatePassword = function (req, res) {};

module.exports = {
  createNewCustomer,
  login,
};

// module.exports = {
//   listCustomer: (req, res) => {
//     Customer.find({}).exec(function (err, result) {
//       if (err) {
//         console.log(err);
//         return res.json({ message: "Error" });
//       } else {
//         console.log(result);
//         return res.json(result);
//       }
//     });
//   },

//   createCustomer: (req, res) => {
//     Customer.create(
//       {
//         id: "USR" + (new Date().getTime() % 10000),
//         name: req.body.name,
//         phone: req.body.phone,
//         email: req.body.email,
//         password: req.body.password,
//         address: req.body.address,
//         // birthday: req.body.birthday,
//         type: req.body.type,
//       },
//       function (err, result) {
//         if (err) {
//           console.log(err);
//           return res.json({ message: "Error" });
//         } else {
//           console.log(result);
//           return res.json(result);
//         }
//       }
//     );
//   },
//   infoById: (req, res) => {
//     Customer.findOne({ id: req.params.id }, function (err, result) {
//       if (err) {
//         console.log(err);
//         return res.json({ message: "Error" });
//       } else {
//         console.log(result);
//         return res.json(result);
//       }
//     });
//   },
//   infoByEmail: (req, res) => {
//     Customer.findOne({ email: req.params.email }, function (err, result) {
//       if (err) {
//         console.log(err);
//         return res.json({ message: "Error" });
//       } else {
//         console.log(result);
//         return res.json(result);
//       }
//     });
//   },
//   updateCustomerInfo: (req, res) => {
//     Customer.findOneAndUpdate(
//       { id: req.body.id },
//       {
//         name: req.body.name,
//         phone: req.body.phone,
//         address: req.body.address,
//         birthday: req.body.birthday,
//       },
//       function (err, result) {
//         if (err) {
//           console.log(err);
//           return res.json({ message: "Error" });
//         } else {
//           console.log(result);
//           return res.json(result);
//         }
//       }
//     );
//   },

//   updatePassword: (req, res) => {
//     Customer.findOneAndUpdate(
//       { id: req.body.id },
//       {
//         password: req.body.password,
//       },
//       function (err, result) {
//         if (err) {
//           console.log(err);
//           return res.json({ message: "Error" });
//         } else {
//           console.log(result);
//           return res.json(result);
//         }
//       }
//     );
//   },
// };
