const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bkfabric2022@gmail.com",
    pass: "BkFabric@2022",
  },
});

const sendEmail = (req, res) => {
  let message = {
    from: "bkfabric2022@gmail.com",
    to: req.body.email,
    subject: req.body.subject,
    html: "",
  };
  switch (req.body.email_type) {
    case "export_bill_success":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Hóa đơn với MĐH${req.body.bill_id} của đơn hàng với MHĐ${req.body.order_id} đã được xuất thành công
      </p>`;
      break;
    case "bill_status_change":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Hóa đơn với MĐH${req.body.bill_id} đã được chuyển sang trạng thái ${req.body.bill_status}<p>`;
      break;
    case "shipping_success":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Hóa đơn với MĐH${req.body.bill_id} của đơn hàng với MHĐ${req.body.order_id} đã được vận chuyển thành công<p>`;
      break;
    case "shipping_failed":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Hóa đơn với MĐH${req.body.bill_id} của đơn hàng với MHĐ${req.body.order_id} vận chuyển thất bại<p>`;
      break;
    case "create_order_success":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Đơn đặt hàng với MHĐ${req.body.order_id} được đặt thành công<p>`;
      break;
    case "cancel_bill":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Hóa đơn với MĐH${req.body.bill_id} của đơn hàng với MHĐ${req.body.order_id} bị hủy<p>`;
      break;
    case "finish_order":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Đơn đặt hàng với MHĐ${req.body.order_id} đã được vận chuyển thành công<p>`;
      break;
    case "cancel_order":
      message.html = `
      <h2>Dear Mr/Ms ${req.body.customer_name}</h2><br/>
      <p>Đơn đặt hàng với MHĐ${req.body.order_id} đã bị hủy<p>`;
      break;
  }
  console.log(req.body);
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      res.send(info);
    }
  });
};

module.exports = { sendEmail };
