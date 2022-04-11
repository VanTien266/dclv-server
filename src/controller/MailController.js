const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shipper.tinh@gmail.com",
    pass: "Tinh@123",
  },
});

let message = {
  from: "shipper.tinh@gmail.com",
  to: "customer.tien@gmail.com",
  subject: "Test 1",
  html: "<h1>Hello SMTP Email</h1>",
};

const sendEmail = (req, res) => {
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      res.send(info);
    }
  });
};

module.exports = { sendEmail };
