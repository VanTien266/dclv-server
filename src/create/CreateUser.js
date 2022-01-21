const { User } = require("../models/User");

function InsertToUser() {
    for (let i = 0; i < 3; i++)
    User.create(
            {
                name: "John",
                email:"test@gmail.com",
                password:"123456"
            },
            function (err, data) {
                if (err) console.log(err);
                else console.log(data);
            }
        );
}
module.exports = { InsertToUser };
