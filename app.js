const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://tiencot:Matkhau20062000@cluster0.5t3jj.mongodb.net/LVTN?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: String,
    name: String,
    role: String,
  },
  { collection: "user" }
);

const User = mongoose.model("user", userSchema);
module.exports = { User };
// const data = User.find({});
// console.log(data);
console.log(User.find({}));
User.find(function (err, user) {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});
