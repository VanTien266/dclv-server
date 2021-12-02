const { MarketPrice } = require("../models/MarketPrice");

const listPrice = [100000, 150000, 2000000, 300000, 230000, 120000, 280000];

function InsertToMarketPrice() {
  listPrice.forEach((item) => {
    MarketPrice.create(
      {
        dayApplied: new Date().setDate(Math.floor(Math.random() * 30)),
        price: listPrice[Math.floor(Math.random() * 7)].toString(),
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

module.exports = { InsertToMarketPrice };
