"use strict";
const express = require("express");

const router = express.Router();

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
} = require("../controller/BillController");

router.get("/api/bill", getListBill);
router.get("/api/bill/:id", getListBillByOrderId);
// router.post("/api/bill/create")

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
