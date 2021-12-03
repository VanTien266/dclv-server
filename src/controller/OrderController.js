const { Orders } = require("../models/Orders");

module.exports = {
    list: (req, res) => {
        Orders.find({}, function (err, result) {
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
        Orders.create(
            {
                id: "MDH" + (new Date().getTime() % 1000000),
                status: req.body.status,
                // orderTime: req.body.orderTime,
                note: req.body.note,
                receiverName: req.body.receiverName,
                receiverPhone: req.body.receiverPhone,
                address: req.body.address,
                deposit: req.body.deposit,
                clientID: req.body.clientID,
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
    detail: (req, res) => {
        Orders.find({ id: req.params.id }, function (err, result) {
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
        Orders.findOneAndUpdate(
            { id: req.body.id },
            {
                note: req.body.note,
                receiverName: req.body.receiverName,
                receiverPhone: req.body.receiverPhone,
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
    updateStatus: (req, res) => {
        Orders.findOneAndUpdate(
            { id: req.body.id },
            { status: req.body.status },
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
    }
};
