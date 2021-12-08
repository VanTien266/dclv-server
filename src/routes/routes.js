"use strict";
const express = require("express");
const router = express.Router();

const {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
} = require("../controller/ProductController");

const {
  list,
  create,
  detail,
  updateInfo,
  updateStatus,
} = require("../controller/OrderController");
const { listBill } = require("../controller/BillController");

/*----order route------*/
router.get("/order", list);
router.post("/order/create", create);
router.get("/order/:id, detail");
router.put("/order/update_info", updateInfo);
router.put("/order/update_status", updateStatus);
/*---------------------*/

/*----bill route-------*/
router.get("/bill", listBill);



/*---------------------*/

/*-----product route------*/
router.get("/api/product", getProductList);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);
/*------------------------*/

module.exports = router;
