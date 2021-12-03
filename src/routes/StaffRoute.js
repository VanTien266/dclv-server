'use strict';
module.exports = function(app) {
    let staffCtrl = require("../controller/StaffController");
    
    app.route("/staff").get(staffCtrl.list);
    app.route("/staff/create").post(staffCtrl.create);
    app.route("/staff/:id").get(staffCtrl.infoById);
    app.route("/staff/:email").get(staffCtrl.infoByEmail);
    app.route("/staff/update_info").post(staffCtrl.updateInfo);
    app.route("/staff/update_password").post(staffCtrl.updatePassword);
    
}