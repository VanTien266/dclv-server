require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT;
const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;

const router = require("./src/routes/routes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

mongoose
  .connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB successfull!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    // const { InsertToItem } = require("./src/create/CreateItem");
    // InsertToItem();
  })
  .catch((error) => {
    console.log("Connect to MongoDB failed!" + error);
  });
