const { Bill } = require("../models/Bill");
const mongoose = require("mongoose");
const { getListOrderId } = require("../services/OrderService");
const { getListFabricRollUsedId } = require("../services/FabricRollService");
const {
  getListSalesmanId,
  getListCustomerId,
  getListShipperId,
} = require("../services/UserService");
const { getListBillId, getClientId } = require("../services/BillService");

const listBillStatus = ["exported", "shipping", "completed", "failed"];

async function InsertToBill() {
  const listOrderId = await getListOrderId();
  // console.log(listOrderId);
  const listFabicRollUsedId = await getListFabricRollUsedId();
  // console.log(listFabicRollUsedId);
  const listSalesmanId = await getListSalesmanId();
  // console.log(listSalesmanId);
  const listCustomerId = await getListCustomerId();
  // console.log(listCustomerId);
  const listShipperId = await getListShipperId();
  // console.log(listShipperId);

  for (let i = 0; i <= 5; i++)
    Bill.create(
      {
        billID: i + 1,
        billStatus: listBillStatus[Math.floor(Math.random() * 4)],
        exportBillTime: Date.now(),
        address: "268 LTK, P14, Q10, TPHCM",
        valueBill: 0,
        // clientID:
        //   listCustomerId[Math.floor(Math.random() * listCustomerId.length)],
        shipperID:
          listShipperId[Math.floor(Math.random() * listShipperId.length)],
        orderID: listOrderId[Math.floor(Math.random() * listOrderId.length)],
        salesmanID:
          listSalesmanId[Math.floor(Math.random() * listSalesmanId.length)],
        fabricRoll: [
          listFabicRollUsedId[i * 10],
          listFabicRollUsedId[i * 10 + 1],
          listFabicRollUsedId[i * 10 + 2],
          listFabicRollUsedId[i * 10 + 3],
          listFabicRollUsedId[i * 10 + 4],
          listFabicRollUsedId[i * 10 + 5],
          listFabicRollUsedId[i * 10 + 7],
          listFabicRollUsedId[i * 10 + 8],
          listFabicRollUsedId[i * 10 + 9],
        ],
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  for (let i = 6; i <= 10; i++)
    Bill.create(
      {
        billID: i + 1,
        billStatus: listBillStatus[Math.floor(Math.random() * 4)],
        exportBillTime: Date.now(),
        address: "268 LTK, P14, Q10, TPHCM",
        valueBill: 0,
        // clientID:
        //   listCustomerId[Math.floor(Math.random() * listCustomerId.length)],
        // clientID: "",
        shipperID:
          listShipperId[Math.floor(Math.random() * listShipperId.length)],
        orderID: listOrderId[Math.floor(Math.random() * listOrderId.length)],
        salesmanID:
          listSalesmanId[Math.floor(Math.random() * listSalesmanId.length)],
        fabricRoll: [
          listFabicRollUsedId[i * 10],
          listFabicRollUsedId[i * 10 + 1],
          listFabicRollUsedId[i * 10 + 2],
          listFabicRollUsedId[i * 10 + 3],
          listFabicRollUsedId[i * 10 + 4],
        ],
      },
      function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      }
    );
  Bill.create(
    {
      billID: 12,
      billStatus: listBillStatus[Math.floor(Math.random() * 4)],
      exportBillTime: Date.now(),
      address: "268 LTK, P14, Q10, TPHCM",
      valueBill: 0,
      // clientID:
      //   listCustomerId[Math.floor(Math.random() * listCustomerId.length)],
      shipperID:
        listShipperId[Math.floor(Math.random() * listShipperId.length)],
      orderID: listOrderId[Math.floor(Math.random() * listOrderId.length)],
      salesmanID:
        listSalesmanId[Math.floor(Math.random() * listSalesmanId.length)],
      fabricRoll: [
        listFabicRollUsedId[110],
        listFabicRollUsedId[111],
        listFabicRollUsedId[112],
        listFabicRollUsedId[113],
        listFabicRollUsedId[114],
        listFabicRollUsedId[115],
        listFabicRollUsedId[116],
        listFabicRollUsedId[117],
        listFabicRollUsedId[118],
        listFabicRollUsedId[119],
        listFabicRollUsedId[120],
        listFabicRollUsedId[121],
        listFabicRollUsedId[122],
        listFabicRollUsedId[123],
        listFabicRollUsedId[124],
        listFabicRollUsedId[125],
        listFabicRollUsedId[126],
        listFabicRollUsedId[127],
        listFabicRollUsedId[128],
        listFabicRollUsedId[129],
        listFabicRollUsedId[130],
        listFabicRollUsedId[131],
        listFabicRollUsedId[132],
        listFabicRollUsedId[133],
        listFabicRollUsedId[134],
        listFabicRollUsedId[135],
        listFabicRollUsedId[136],
        listFabicRollUsedId[137],
        listFabicRollUsedId[138],
        listFabicRollUsedId[139],
        listFabicRollUsedId[140],
        listFabicRollUsedId[141],
      ],
    },
    function (err, data) {
      if (err) console.log(err);
      else console.log(data);
    }
  );
}

async function updateClient() {
  const listBillId = (await getListBillId()) || [];
  console.log("list bill", listBillId);
  listBillId.forEach(async (item) => {
    const clientID = await getClientId(item);
    console.log(clientID.orderID.clientID);
    Bill.findOneAndUpdate(
      { _id: item },
      { $set: { clientID: clientID.orderID.clientID } }
    ).exec(function (err, response) {
      if (err) console.log(err);
      else console.log(response);
    });
  });
}
const reasonList = ["Khách đi vắng", "Khách boom hàng", "Hàng bị lỗi"];
async function updateSatusField() {
  // Bill.updateMany(
  //   { "status.name": "failed" },
  //   {
  //     $set: {
  //       "status.$.reason":
  //         reasonList[Math.floor(Math.random() * reasonList.length)],
  //     },
  //   },
  //   function (err, response) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log("done!");
  //   }
  // );
  // Bill.updateMany({}, { $unset: { billStatus: 1 } }, function (err, response) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log("done!");
  // });
}
module.exports = { InsertToBill, updateClient, updateSatusField };
