"use strict";

module.exports = function(app) {
    let clientCtrl = require("../controller/ClientController");

    app.route("/client").get(clientCtrl.list);
    app.route("/client/create").post(clientCtrl.create);
    app.route("/client/:id").get(clientCtrl.infoById);
    app.route("/client/:email").get(clientCtrl.infoByEmail);
    app.route("/client/update_info").post(clientCtrl.updateInfo);
    app.route("/client/update_password").post(clientCtrl.updatePassword);
}