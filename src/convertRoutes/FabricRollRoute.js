"use strict";

module.exports = function(app) {
    let FabricRollCtrl = require("../controller/FabricRollController");

    app.route("/order/change_status").put(FabricRollCtrl.changeStatus);
}