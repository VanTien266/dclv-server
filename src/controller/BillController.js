const { Bill } = require("../models/Bill");
const { Counter } = require("../models/Counter");
const mongoose = require("mongoose");

async function getNextSequenceValue(sequenceName) {
  let seq = await Counters.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }
  ).exec();
  return seq.sequence_value;
}

const getListBill = async (req, res) => {
  Bill.find({}, function (err, result) {
    if (err) {
      console.log(err);
      return res.json({ message: "Error" });
    } else {
      console.log(result);
      return res.json(result);
    }
  });
};

const getListBillByOrderId = async (req, res) => {
  const _id = mongoose.Types.ObjectId(req.params.id);
  Bill.find({ orderID: _id }).exec(function (err, result) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(`Get list bill of ${_id} success!`);
      res.json(result);
    }
  });
};

const getBillDetail = async (req, res) => {
  const _id = mongoose.Types.ObjectId(req.query._id);
  Bill.findOne({ _id: _id }).exec(function (err, result) {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      console.log(result);
      return res.json(result);
    }
  });
};

module.exports = { getListBill, getListBillByOrderId, getBillDetail };
// create: async (req, res) => {
//     const id = await getNextSequenceValue("orderId");
//     Orders.create(
//         {
//             orderId: id,
//             orderStatus: req.body.orderStatus,
//             // orderTime: req.body.orderTime,
//             note: req.body.note,
//             receiverName: req.body.receiverName,
//             receiverPhone: req.body.receiverPhone,
//             receiverAddress: req.body.receiverAddress,
//             deposit: req.body.deposit,
//             clientID: req.body.clientID,
//             detailBill: req.body.detailBill,
//             products: req.body.products,
//         },
//         function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return res.json({ message: "Error" });
//             } else {
//                 console.log(result);
//                 return res.json(result);
//             }
//         }
//     );
// },

// updateInfo: (req, res) => {
//     Orders.findOneAndUpdate(
//         { id: req.body.id },
//         {
//             note: req.body.note,
//             receiverName: req.body.receiverName,
//             receiverPhone: req.body.receiverPhone,
//         },
//         function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return res.json({ message: "Error" });
//             } else {
//                 console.log(result);
//                 return res.json(result);
//             }
//         }
//     );
// },
// updateStatus: (req, res) => {
//     Orders.findOneAndUpdate(
//         { id: req.body.id },
//         { status: req.body.status },
//         function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return res.json({ message: "Error" });
//             } else {
//                 console.log(result);
//                 return res.json(result);
//             }
//         }
//     );
// },
