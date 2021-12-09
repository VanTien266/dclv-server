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
const { getListBill } = require("../controller/BillController");
const { getListFabricType } = require("../controller/FabricTypeController");

/*----order route------*/
router.get("/order", list);
router.post("/order/create", create);
router.get("/order/:id", detail);
router.put("/order/update_info", updateInfo);
router.put("/order/update_status", updateStatus);
/*---------------------*/

/*----bill route-------*/
router.get("/api/bill", getListBill);
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
