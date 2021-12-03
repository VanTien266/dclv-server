const { FabricRoll } = require("../models/FabricRoll");

module.exports = {
    changeStatus: (req, res) => {
        FabricRoll.findOneAndUpdate(
            { id: req.body.id },
            { status: req.body.status, billId: req.body.billId },
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
