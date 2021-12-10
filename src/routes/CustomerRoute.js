"use strict";

module.exports = function(app) {
    let customerCtrl = require("../controller/CustomerController");

    app.route("/customer").get(customerCtrl.list);
    app.route("/customer/create").post(customerCtrl.create);
    app.route("/customer/:id").get(customerCtrl.infoById);
    app.route("/customer/:email").get(customerCtrl.infoByEmail);
    app.route("/customer/update_info").post(customerCtrl.updateInfo);
    app.route("/customer/update_password").post(customerCtrl.updatePassword);
}