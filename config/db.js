const mongoose = require("mongoose");
require("dotenv").config();
function connectDB() {
  //   const URL = "";
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL)
    .then((resp) => console.log(" connections successful"))
    .catch((err) => console.log("connection failed "));
  //   console.log(process.env.MONGO_CONNECTION_URL);
  //   const connection = mongoose.connection;
  //   connection
  //     .once("open", () => {
  //       console.log("Database Connected");
  //     })
  //     .on("error", (err) => {
  //       console.log("error in connection");
  //     });
}
module.exports = connectDB;
