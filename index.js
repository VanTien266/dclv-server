require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;
const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;

const router = require("./src/routes/routes");

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

mongoose
  .connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB successfull!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
    const {
      UpdateLot,
      InsertToFabricRoll,
    } = require("./src/create/CreateFabricRoll");
    // UpdateLot();
    // InsertToFabricRoll();
  })
  .catch((error) => {
    console.log("Connect to MongoDB failed!" + error);
  });
