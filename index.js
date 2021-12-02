require("dotenv").config();

const port = process.env.PORT;
const userName = process.env.DB_USER;
const password = process.env.DB_PASS;

const mongodb_url = `mongodb+srv://${userName}:${password}@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;

const mongoose = require("mongoose");
const express = require("express");

const app = express();

//Import from
const { InsertToFabricRoll } = require("./src/create/CreateFabricRoll");
const { InsertToFabricType } = require("./src/create/CreateFabricType");
const { InsertToMarketPrice } = require("./src/create/CreateMarketPrice");
const { InsertToItem } = require("./src/create/CreateItem");

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  mongoose.connect(mongodb_url).catch((error) => handleError(error));

  // InsertToFabricRoll();
  // InsertToFabricType();
  // InsertToMarketPrice();
  // InsertToItem();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
