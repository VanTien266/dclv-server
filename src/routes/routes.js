"use strict";
const express = require("express");

const router = express.Router();
const verify = require("../auth/checkToken")

const {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
} = require("../controller/FabricRollController");
const {
  list,
  create,
  detail,
  updateInfo,
  updateStatus,
  countAllOrder,
  countAllOrderComplete,
  deposit,
} = require("../controller/OrderController");

const { getListFabricType } = require("../controller/FabricTypeController");

/*----order route------*/
router.get("/api/order", list);
router.post("/api/order/create", create);
router.get("/api/order/:id", detail);
router.put("/api/order/update_info", updateInfo);
router.put("/api/order/update_status", updateStatus);
router.get("/api/countallorder",countAllOrder);
router.get("/api/countallordercomplete",countAllOrderComplete);
router.get("/api/deposit",deposit);
/*---------------------*/

/*----bill route-------*/
const {
  getListBill,
  getListBillByOrderId,
} = require("../controller/BillController");

router.get("/api/bill", getListBill);
router.get("/api/bill/:id", getListBillByOrderId);
// router.post("/api/bill/create")

const {
  createNewCustomer ,
  login
} = require("../controller/CustomerController");

const { createNewStaff, updatePassword, listStaff, infoStaffById} = require("../controller/StaffController");


//for customer
router.post("/api/register", createNewCustomer);
router.post("/api/login", login)
// router.get('/dashboard', verify, function(req, res){
//   res.send("Chào mừng bạn đến với BK Fabric")
// })

//for Staff
router.post("/api/createstaff", createNewStaff);
// router.put("/updatePassword/:id", updatePassword);

//for admin
router.get("/api/admin/liststaff", listStaff);
router.get("/api/admin/liststaff/info/:id", infoStaffById);


//for product
/*---------------------*/
/*-----FabricType route------*/
router.get("/api/fabrictype", getListFabricType);
/*-----Fabric Roll route------*/
router.get("/api/product", getProductList);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);
/*------------------------*/

// for bill
// router.get("/api/orders", getListProduct);

module.exports = router;
