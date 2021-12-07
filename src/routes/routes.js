const express = require("express");

const router = express.Router();

const {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
} = require("../controller/ProductController");
const { getListProduct } = require("../controller/BillController");

//for product
router.get("/api/product", getProductList);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);

// for bill
router.get("/api/orders", getListProduct);

module.exports = router;
