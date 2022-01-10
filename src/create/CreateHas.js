const mongoose = require("mongoose");
const { Has } = require("../models/Has");
const { getOneProduct } = require("../services/FabricRollService");
const { getOneOrder, getListOrderId } = require("../services/OrderService");

async function InsertToHas() {
  const listOrderId = await getListOrderId();
  // console.log(listOrderId);
  listOrderId.forEach(async (item) => {
    const order = await getOneOrder(item);
    // console.log(item);
    order.products.forEach(async (element) => {
      const fabricRoll = await getOneProduct(element);
      // console.log(fabricRoll.item);
      //   Has.create(
      //     {
      //       orderId: item,
      //       colorCode: fabricRoll.item._id,
      //       length: fabricRoll.length,
      //       shippedLength: fabricRoll.length,
      //     },
      //     function (err, data) {
      //       if (err) console.log(err);
      //       else console.log(data);
      //     }
      //   );
    });
  });
}

async function IncreaseHas() {
  const data = await Has.find({}).exec();
  data.forEach((item) =>
    Has.updateOne(
      { _id: item._id },
      { $inc: { length: Math.floor(Math.random() * 5) } },
      { multi: true }
    ).exec(function (err, response) {
      if (err) console.log(err);
      else console.log(response);
    })
  );
}

module.exports = { InsertToHas, IncreaseHas };
