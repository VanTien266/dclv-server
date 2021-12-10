const { Order } = require("../models/Order");
const {
  getListProductOfOrder,
  getListBillOfOrder,
} = require("../services/BillService");

const { getListOrderId } = require("../services/OrderService");
const { getListHasOfOrder } = require("../services/HasService");

async function InsertToOrder() {
  const listOrderid = await getListOrderId();
  // console.log(listOrderid);
  // const listProductOfOrder = await getListProductOfOrder(
  //   "61b1cb07e439b691f6b13b31"
  // );
  // console.log(listProductOfOrder);
  // const listBillIdOfOrder = await getListBillIdOfOrder(
  //   "61b1cb07e439b691f6b13b31"
  // );
  // console.log(listBillIdOfOrder);
  listOrderid.forEach(async (item, index) => {
    const listProductOfOrder = await getListProductOfOrder(item);
    const listBillIdOfOrder = await getListBillOfOrder(item);
    Order.create(
      {
        orderId: index + 1,
        orderStatus: "Chờ xử lý",
        note: "",
        orderTime: Date.now(), //pick a random day
        receiverName: "Lưu Văn Tiến",
        receiverPhone: "0987654321",
        receiverAddress: "268 LTK, P14, Q10, TPHCM",
        deposit: Math.floor(Math.random() * 9 + 1) * 100000,
        clientID: null,
        detailBill: listBillIdOfOrder,
        products: listProductOfOrder,
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  });
}

async function updateProduct() {
  const listOrderId = await getListOrderId();
  // console.log(listOrderId);
  listOrderId.forEach(async (item) => {
    const listHasOfOrder = await getListHasOfOrder(item);
    console.log(listHasOfOrder, item);
    Order.findOneAndUpdate(
      { _id: item },
      { products: listHasOfOrder },
      function (err, data) {
        if (!err) console.log("Update Status successfully!");
        else console.log(err);
      }
    );
  });
}

module.exports = { InsertToOrder, updateProduct };
