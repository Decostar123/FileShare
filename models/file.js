const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//  Schema is basically a class whse object I have to make

const fileSchema = new Schema(
  {
    //  it also have deafult parameter
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    sender: { type: String, required: false },
    receiver: { type: String, required: false },
    uniquename: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
