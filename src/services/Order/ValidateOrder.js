const mongoose = require("mongoose");
const { Bill } = require("../../models/Bill");
const { Has } = require("../../models/Has");
const { Order } = require("../../models/Order");

async function CheckOrderStatus(order_id) {
  //Flow: Get list Bill of Order -->Check length
  const order = await Order.findById(mongoose.Types.ObjectId(order_id))
    .populate({ path: "products", populate: { path: "colorCode" } })
    .exec();
  // console.log(order);

  let orderProductMap = new Map();
  order.products.forEach((item) =>
    orderProductMap.set(item.colorCode.colorCode, {
      length: item.length,
      shippedLength: 0,
    })
  );

  //Get list bill info
  const bill_id = order.detailBill;
  // console.log(bill_id);
  let listBillInfo = [];
  for (let i = 0; i < bill_id.length; i++) {
    const bill = await Bill.findById(mongoose.Types.ObjectId(bill_id[i]))
      .populate("fabricRoll")
      .exec();
    // console.log(bill);
    listBillInfo.push(bill);
  }
  if (listBillInfo.length !== 0)
    for (let i = 0; i < listBillInfo.length; i++) {
      listBillInfo[i].fabricRoll.forEach((item) => {
        const value = orderProductMap.get(item.colorCode);
        orderProductMap.set(item.colorCode, {
          ...value,
          shippedLength: (value.shippedLength += item.length),
        });
      });
    }
  //Check status and update
  let status = "completed";
  for (const [key, value] of orderProductMap.entries()) {
    if (value.length <= 50) {
      if (value.length - value.shippedLength > 5) {
        status = "pending";
        break;
      }
    }
    if (value.length > 50) {
      if (value.length - value.shippedLength > 0.05 * value.length) {
        status = "pending";
        break;
      }
    }
  }
  // console.log(status);
  if (
    order.orderStatus[order.orderStatus.length - 1].name !== status &&
    order.orderStatus[order.orderStatus.length - 1].name !== "cancel"
  ) {
    Order.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(order_id) },
      { $push: { orderStatus: { name: status } } },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("OK");
        }
      }
    );
  }
  //Update ShippedLength
  // console.log(order.products);
  order.products.forEach((item) => {
    Has.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item._id) },
      {
        shippedLength: orderProductMap.get(item.colorCode.colorCode)
          .shippedLength,
      },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );
  });
  console.log(orderProductMap);
}

module.exports = { CheckOrderStatus };
