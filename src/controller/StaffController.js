"use strict";
const mongoose = require("mongoose");
// module.exports = {
//     list: (req, res) => {
//         Staffs.find({}, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return res.json({ message: "Error" });
//             } else {
//                 console.log(result);
//                 return res.json(result);
//             }
//         });
//     },

//     create: (req, res) => {
//         Staffs.create(
//             {
//                 id: "STA" + (new Date().getTime() % 10000),
//                 name: req.body.name,
//                 phone: req.body.phone,
//                 email: req.body.email,
//                 password: req.body.password,
//                 address: req.body.address,
//                 // birthday: req.body.birthday,
//                 gender: req.body.gender,
//                 role: req.body.role,
//             },
//             function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     return res.json({ message: "Error" });
//                 } else {
//                     console.log(result);
//                     return res.json(result);
//                 }
//             }
//         );
//     },

//     infoById: (req, res) => {
//         Staffs.findOne({ id: req.params.id }, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return res.json({ message: "Error" });
//             } else {
//                 console.log(result);
//                 return res.json(result);
//             }
//         });
//     },

//     infoByEmail: (req, res) => {
//         Staffs.findOne({ email: req.params.email }, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return res.json({ message: "Error" });
//             } else {
//                 console.log(result);
//                 return res.json(result);
//             }
//         });
//     },

//     updateInfo: (req, res) => {
//         Staffs.findOneAndUpdate(
//             { id: req.body.id },
//             {
//                 name: req.body.name,
//                 phone: req.body.phone,
//                 address: req.body.address,
//                 gender: req.body.gender,
//                 birthday: req.body.birthday,
//             },
//             function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     return res.json({ message: "Error" });
//                 } else {
//                     console.log(result);
//                     return res.json(result);
//                 }
//             }
//         );
//     },

//     updatePassword: (req, res) => {
//         Staffs.findOneAndUpdate(
//             { id: req.body.id },
//             {
//                 password: req.body.password,
//             },
//             function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     return res.json({ message: "Error" });
//                 } else {
//                     console.log(result);
//                     return res.json(result);
//                 }
//             }
//         );
//     },
// };

const { Staff } = require("../models/Staff");
const {
  registerValidationStaff,
  loginValidation,
} = require("../auth/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createNewStaff = async (req, res) => {
  // Validate user
  const { error } = registerValidationStaff(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email có tồn tại hay không
  const emailExist = await Staff.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email đã tồn tại");

  // Kiểm tra số điện thoại có tồn tại hay không
  const phoneExist = await Staff.findOne({ phone: req.body.phone });
  if (phoneExist) return res.status(400).send("Số điện thoại đã tồn tại");

  // Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  const newStaff = new Staff();
  newStaff.id = "ID" + (new Date().getTime() % 10000);
  newStaff.name = req.body.name;
  newStaff.email = req.body.email;
  newStaff.password = hashPass;
  newStaff.phone = req.body.phone;
  newStaff.address = req.body.address;
  newStaff.birthday = req.body.birthday;
  newStaff.role = req.body.role;
  newStaff.gender = req.body.gender;
  try {
    const Staff = await newStaff.save();
    res.send(Staff);
  } catch (err) {
    res.status(400).send(err);
  }
};

const loginstaff = async (req, res) => {
  // Validate user
  console.log(req.body);
  const { error } = loginValidation(req.body);
  if (error) return res.status(403).send(error.details[0].message);

  // Kiểm tra email
  const userLogin = await Staff.findOne({ email: req.body.email });
  if (!userLogin) return res.status(403).send("Không tìm thấy email");

  // Kiểm tra password
  const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
  if (!passLogin) {
    return res.status(403).send("Mật khẩu không hợp lệ");
  }

  // Ký và tạo token
  const token = jwt.sign({ _id: userLogin._id }, process.env.SECRET_TOKEN);
  res.send({ ...userLogin._doc, jwt: token });
};

// const updatePassword = async (req, res) {
//     // Kiểm tra password
//     const oldpassword = await bcrypt.compare(req.body.password, userLogin.password);
//     if(!passLogin) return res.status(400).send("Mật khẩu không hợp lệ")

// }

// const updateInfo = async (req, res) => {
//     try {
//         const body = req.body;
//         const id = req.params.id

//         Staff.findOneAndUpdate({ _id: id }, body, function (err, data) {
//           if (!err) res.status(200).json("Update Status successfully!");
//         });
//       } catch (err) {
//         res.status(500).json({ err });
//       }
// }

const listStaff = async (req, res) => {
  Staff.find({}, function (err, result) {
    if (err) {
      console.log(err);
      return res.json({ message: "Error" });
    } else {
      console.log(result);
      return res.json(result);
    }
  });
};

const infoStaffById = async (req, res) => {
  Staff.findOne({ _id: req.params.id }, function (err, result) {
    if (err) {
      console.log(err);
      return res.json({ message: "Error" });
    } else {
      console.log(result);
      return res.json(result);
    }
  });
  // Staff.find({}, function (err, result) {
  //     if (err) {
  //         console.log(err);
  //         return res.json({ message: "Error" });
  //     } else {
  //         console.log(result);
  //         return res.json(result);
  //         }
  // });
  try {
    const result = await Staff.aggregate([{ $match: {} }]);
    console.log("Get List Staff Completed successfully");
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getAllSalesman = (req, res) => {
  try {
    Staff.aggregate(
      [
        { $match: { role: { $eq: "SALESMAN" } } },
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ],
      function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else {
          console.log(data);
          res.status(200).json(data);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createNewStaff,
  loginstaff,
  // updateInfo,
  listStaff,
  infoStaffById,
  getAllSalesman,
};
