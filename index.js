require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;
// const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;
const mongodb_url = `mongodb+srv://nguyenvantinh06:Nguyenvantinh2625@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;

const router = require("./src/routes/routes");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

let StaffRoute = require("./src/routes/StaffRoute");
let CustomerRoute = require("./src/routes/CustomerRoute");
let FabricRollRoute = require("./src/routes/FabricRollRoute");
let OrderRoute = require("./src/routes/OrderRoute");

StaffRoute(app);
CustomerRoute(app);
FabricRollRoute(app);
OrderRoute(app);

mongoose
  .connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB successfull!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    // const { InsertToStaff } = require("./src/create/CreateStaff");
    // InsertToStaff();
  })
  .catch((error) => {
    console.log("Connect to MongoDB failed!" + error);
  });
