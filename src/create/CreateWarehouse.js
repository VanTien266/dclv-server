import { Warehouse } from "../models/Warehouse";
import { getWarehouseCapacity } from "../services/WarehouseService";

const warehouseList = ["K1", "K2", "K3", "K4", "K5", "K6", "K7"];
function CreateWarehouse() {
  warehouseList.forEach((item) => {
    Warehouse.create(
      {
        id: item,
        address: "Linh Trung - Tp Thủ Đức - Tp Hồ Chí Minh ",
        capacity: getWarehouseCapacity(item),
      },
      function (err, data) {
        if (err) console.log(err);
        else {
          console.log(data);
        }
      }
    );
  });
}

export default { CreateWarehouse };
