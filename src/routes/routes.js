"use strict";
const express = require("express");

const router = express.Router();
const verify = require("../auth/checkToken");

const {
  list,
  create,
  detail,
  updateInfo,
  updateStatus,
  countAllOrder,
  countAllOrderComplete,
  deposit,
  getOrderbyDateRange,
  getFabricTypeOrder,
  getOrderStatus
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
router.get("/api/getorderrange", getOrderbyDateRange);
router.get("/api/getfabrictypeorder", getFabricTypeOrder);
router.get("/api/getorderstatus", getOrderStatus);

/*---------------------*/

/*----bill route-------*/
const {
  getListBill,
  getListBillByOrderId,
  getBillDetail,
  getFabricRollBillComplete,
  getListBillByIds,
  getBillComplete,
} = require("../controller/BillController");

router.get("/api/bill", getListBill);
router.post("/api/bill/list", getListBillByIds);
router.get("/api/bill/detail/:id", getBillDetail);
router.get("/api/bill/fabricrollcompleted", getFabricRollBillComplete);
router.get("/api/bill/completed", getBillComplete);

// router.post("/api/bill/create")
/*---------------------*/

const {
  createNewCustomer,
  login,
} = require("../controller/CustomerController");

const {
  createNewStaff,
  listStaff,
  infoStaffById,
} = require("../controller/StaffController");

//for customer
router.post("/api/register", createNewCustomer);
router.post("/api/login", login);
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
/*----Customer route-------*/
// const {
//   listCustomer,
//   createCustomer,
//   infoById,
//   infoByEmail,
//   updateCustomerInfo,
//   updatePassword,
// } = require("../controller/CustomerController");
// router.get("/api/customer", listCustomer);
// router.post("/api/customer/create", createCustomer);
// router.get("/api/customer/:id", infoById);
// router.get("/api/customer/:email", infoByEmail);
// router.post("/api/customer/update_info", updateCustomerInfo);
// router.post("/api/customer/update_password", updatePassword);
/*---------------------*/

/*-----FabricType route------*/
router.get("/api/fabrictype", getListFabricType);
/*-----Fabric Roll route------*/
const {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
  getListFabricRollWithIds,
  getChartWarehouseTrue,
  getFabricTypeSell
} = require("../controller/FabricRollController");

router.get("/api/product", getProductList);
router.post("/api/product/list", getListFabricRollWithIds);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);
router.get("/api/chartwarehouse", getChartWarehouseTrue);
router.get("/api/getfabrictypesell", getFabricTypeSell);


/*------------------------*/

module.exports = router;
