"use strict";
const { Staffs } = require("../models/Staff");

module.exports = {
    list: (req, res) => {
        Staffs.find({}, function (err, result) {
            if (err) {
                console.log(err);
                return res.json({ message: "Error" });
            } else {
                console.log(result);
                return res.json(result);
            }
        });
    },

    create: (req, res) => {
        Staffs.create(
            {
                id: "STA" + (new Date().getTime() % 10000),
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                address: req.body.address,
                // birthday: req.body.birthday,
                gender: req.body.gender,
                role: req.body.role,
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Error" });
                } else {
                    console.log(result);
                    return res.json(result);
                }
            }
        );
    },

    infoById: (req, res) => {
        Staffs.findOne({ id: req.params.id }, function (err, result) {
            if (err) {
                console.log(err);
                return res.json({ message: "Error" });
            } else {
                console.log(result);
                return res.json(result);
            }
        });
    },

    infoByEmail: (req, res) => {
        Staffs.findOne({ email: req.params.email }, function (err, result) {
            if (err) {
                console.log(err);
                return res.json({ message: "Error" });
            } else {
                console.log(result);
                return res.json(result);
            }
        });
    },

    updateInfo: (req, res) => {
        Staffs.findOneAndUpdate(
            { id: req.body.id },
            {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                gender: req.body.gender,
                birthday: req.body.birthday,
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Error" });
                } else {
                    console.log(result);
                    return res.json(result);
                }
            }
        );
    },

    updatePassword: (req, res) => {
        Staffs.findOneAndUpdate(
            { id: req.body.id },
            {
                password: req.body.password,
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Error" });
                } else {
                    console.log(result);
                    return res.json(result);
                }
            }
        );
    },
};
