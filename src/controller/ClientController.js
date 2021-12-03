const {Clients} = require("../models/Client");

module.exports = {
    list: (req, res) => {
        Clients.find({}, function (err, result) {
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
        Clients.create(
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
        Clients.findOne({ id: req.params.id }, function (err, result) {
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
        Clients.findOne({ email: req.params.email }, function (err, result) {
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
        Clients.findOneAndUpdate(
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