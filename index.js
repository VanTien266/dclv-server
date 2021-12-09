// require("dotenv").config();
// import {} from "dotenv/config";
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import { connect } from "mongoose";
import express, { json } from "express";
import { json as _json, urlencoded } from "body-parser";
import cors from "cors";

const port = process.env.PORT || 5000;
const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;
// const mongodb_url = `mongodb+srv://nguyenvantinh06:Nguyenvantinh2625@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority`;

import router from "./src/routes/routes";

const app = express();
app.use(_json());
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(router);

connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB successfull!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    // const { InsertToItem } = require("./src/create/CreateItem");
    // InsertToItem();
    // import { CreateWarehouse } from "./src/create/CreateWarehouse";
  })
  .catch((error) => {
    console.log("Connect to MongoDB failed!" + error);
  });
