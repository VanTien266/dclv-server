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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

mongoose
  .connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB successfull!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    const { ValidateOrder } = require("./src/services/Order/ValidateOrder");
    // ValidateOrder("61bb45f4fcfed50810d281a9");
    const { UpdateItem } = require("./src/create/CreateItem");
    // UpdateItem();
    const { updateLength } = require("./src/create/CreateFabricRoll");
    // updateLength();
  })
  .catch((error) => {
    console.log("Connect to MongoDB failed!" + error);
  });
