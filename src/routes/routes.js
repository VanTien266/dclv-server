const express = require("express");

const router = express.Router();
const verify = require("../auth/checkToken")

const {
  getProductList,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
} = require("../controller/ProductController");
const { getListProduct } = require("../controller/BillController");

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
router.get("/api/admin/liststaff/:id", infoStaffById);


//for product
router.get("/api/product", getProductList);
router.get("/api/product/:id", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);

// for bill
router.get("/api/orders", getListProduct);

module.exports = router;
