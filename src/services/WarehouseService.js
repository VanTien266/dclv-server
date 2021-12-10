const { FabricRoll } = require("../models/FabricRoll");

async function getWarehouseCapacity(warehouseId) {
  const result = await FabricRoll.count({ warehouseId: warehouseId }).exec();
  return result;
}

module.exports = { getWarehouseCapacity };
