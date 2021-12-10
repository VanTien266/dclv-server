const {Customers} = require("../models/Customer");

module.exports = {
    list: (req, res) => {
        Customers.find({}, function (err, result) {
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
        Customers.create(
            {
                id: "USR" + (new Date().getTime() % 10000),
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                address: req.body.address,
                // birthday: req.body.birthday,
                type: req.body.type,
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
        Customers.findOne({ id: req.params.id }, function (err, result) {
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
        Customers.findOne({ email: req.params.email }, function (err, result) {
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
        Customers.findOneAndUpdate(
            { id: req.body.id },
            {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
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
        Customers.findOneAndUpdate(
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
}