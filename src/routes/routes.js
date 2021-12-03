const express = require("express");
const router = express.Router();

const {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
} = require("../controller/ProductController");

router.get("/api/product", getProductList);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);

module.exports = router;
