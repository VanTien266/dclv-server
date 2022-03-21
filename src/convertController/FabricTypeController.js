const express = require("express");
const mongoose = require("mongoose");
const { FabricType } = require("../models/FabricType");

const getListFabricType = async (req, res) => {
  try {
    const listType = await FabricType.aggregate([{ $match: {} }]);
    res.status(200).json(listType);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed");
  }
};

module.exports = { getListFabricType };
