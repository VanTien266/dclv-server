"use strict";
const express = require("express");

const router = express.Router();
const verify = require("../auth/checkToken");

const {
  list,
  create,
  detail,
  updateInfo,
  getListProductsById,
  updateStatus,
  deposit,
  getFabricTypeOrder,
  getOrderStatus,
  getOrderDaily,
  getTotalOrderbyMonth,
  getOrderFabricType,
  cancleExportBill,
  getOrderByCustomer,
} = require("../controller/OrderController");

const { getListFabricType } = require("../controller/FabricTypeController");

/*----order route------*/
router.get("/api/order", list);
router.post("/api/order/create", create);
router.get("/api/order/:id", detail);
router.get("/api/order/:id/products", getListProductsById);
router.put("/api/order/update_info", updateInfo);
router.put("/api/order/:id/update_status", updateStatus);
router.get("/api/deposit", deposit);
router.get("/api/getfabrictypeorder", getFabricTypeOrder);
router.get("/api/getorderstatus", getOrderStatus);
router.get("/api/getorderdaily", getOrderDaily);
router.get("/api/getorderbymonth", getTotalOrderbyMonth);
router.get("/api/getorderfabrictype", getOrderFabricType);
router.put("/api/order/cancle-status/:id", cancleExportBill);
router.get("/api/order/customer/:id", getOrderByCustomer);

/*----bill route-------*/
const {
  getListBill,
  createBill,
  getListBillByOrderId,
  getBillDetail,
  getFabricRollBillCompleted,
  getListBillByIds,
  getBillComplete,
  getBillStatus,
  getBillFabricTypeSell,
  getListBillUncomplete,
  getListBillComplete,
  updateBillStatus,
} = require("../controller/BillController");

router.get("/api/bill", getListBill);
router.get("/api/bill/list/uncomplete", getListBillUncomplete);
router.get("/api/bill/list/complete", getListBillComplete);
router.post("/api/bill/create", createBill);
router.get("/api/bill/list", getListBillByIds);
router.get("/api/bill/order/:orderid", getListBillByOrderId);
router.get("/api/bill/detail/:id", getBillDetail);
router.get("/api/bill/fabricrollcompleted", getFabricRollBillCompleted);
router.get("/api/bill/completed", getBillComplete);
router.get("/api/bill/status", getBillStatus);
router.get("/api/bill/fabrictypesell", getBillFabricTypeSell);
router.put("/api/bill/:id", updateBillStatus);
/*---------------------*/

const {
  createNewCustomer,
  login,
} = require("../controller/CustomerController");
const {
  createNewStaff,
  listStaff,
  infoStaffById,
  loginstaff,
  getAllSalesman,
} = require("../controller/StaffController");

//for customer
router.post("/api/register", createNewCustomer);
router.post("/api/customer/login", login);

//for Staff
router.post("/api/staff/login", loginstaff);
router.post("/api/createstaff", createNewStaff);
router.get("/api/staff/salesman", getAllSalesman);

//for admin
router.get("/api/admin/liststaff", listStaff);
router.get("/api/admin/liststaff/info/:id", infoStaffById);

//for product
/*----Customer route-------*/
/*---------------------*/

/*-----FabricType route------*/
router.get("/api/fabrictype", getListFabricType);
/*---------------------*/

/*-----Fabric Roll route------*/
const {
  getProductList,
  getProductList1,
  getProductById,
  updateProductStatus,
  updateMarketPrice,
  getListFabricRollWithIds,
  getFabricRollOfBill,
  getChartWarehouseTrue,
  getFabricTypeWarehouse,
  getListColorcode,
  getFullListFabricType,
} = require("../controller/FabricRollController");

router.get("/api/product", getProductList);
router.get("/api/product1", getProductList1);
router.post("/api/product/list", getListFabricRollWithIds);
router.post("/api/product/fabricroll-bill", getFabricRollOfBill);
router.get("/api/product/detail", getProductById);
router.put("/api/product/:id", updateProductStatus);
router.put("/api/product/item/:id", updateMarketPrice);
router.get("/api/chartwarehouse", getChartWarehouseTrue);
router.get("/api/getfabricwarehouse", getFabricTypeWarehouse);
router.get("/api/product/list-type", getFullListFabricType);
router.get("/api/product/colorcode", getListColorcode);
/*------------------------*/

/*-----Support Request route------*/
const {
  createSupport,
  responseRequest,
  getAllRequest,
} = require("../controller/SupportRequestController");

router.get("/api/support/all", getAllRequest);
router.post("/api/support/create", createSupport);
router.put("/api/support/response", responseRequest);

module.exports = router;
