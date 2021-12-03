"use strict";
module.exports = function(app) {
    let OrderCtrl = require("../controller/OrderController");

    app.route("/order").get(OrderCtrl.list);
    app.route("/order/create").post(OrderCtrl.create);
    app.route("/order/:id").get(OrderCtrl.detail);
    app.route("/order/update_info").post(OrderCtrl.updateInfo);
    app.route("/order/update_status").post(OrderCtrl.updateStatus);
}