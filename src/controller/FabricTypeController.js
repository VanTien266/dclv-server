const express = require("express");
const mongoose = require("mongoose");
const { FabricType } = require("../models/FabricType");

const getListFabricType = (req, res) => {
  FabricType.find({}).exec(function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      console.log("Get all Fabric Type success!");
      res.status(200).json(result);
    }
  });
};

module.exports = { getListFabricType };
