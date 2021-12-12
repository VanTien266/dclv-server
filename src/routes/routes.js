"use strict";
const express = require("express");

const router = express.Router();

const {
  list,
  create,
  detail,
  updateInfo,
  updateStatus,
} = require("../controller/OrderController");

const { getListFabricType } = require("../controller/FabricTypeController");

/*----order route------*/
router.get("/api/order", list);
router.post("/api/order/create", create);
router.get("/api/order/:id", detail);
router.put("/api/order/update_info", updateInfo);
router.put("/api/order/update_status", updateStatus);
/*---------------------*/

/*----bill route-------*/
const {
  getListBill,
  getListBillByOrderId,
  getBillDetail,
} = require("../controller/BillController");

router.get("/api/bill", getListBill);
router.get("/api/bill/detail", getBillDetail);
// router.post("/api/bill/create")
/*---------------------*/

/*----Customer route-------*/
const {
  listCustomer,
  createCustomer,
  infoById,
  infoByEmail,
  updateCustomerInfo,
  updatePassword,
} = require("../controller/CustomerController");
router.get("/api/customer", listCustomer);
router.post("/api/customer/create", createCustomer);
router.get("/api/customer/:id", infoById);
router.get("/api/customer/:email", infoByEmail);
router.post("/api/customer/update_info", updateCustomerInfo);
router.post("/api/customer/update_password", updatePassword);
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
} = require("../controller/FabricRollController");

router.get("/api/product", getProductList);
router.post("/api/product/list", getListFabricRollWithIds);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);
/*------------------------*/

module.exports = router;
