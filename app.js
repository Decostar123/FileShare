const express = require("express");
const app = express();
const dotenv = require("dotenv");
const file = require("./models/file");
const fs = require("fs");
// file.createIndexes({ createdAt: 1 }, { expireAfterSeconds: 86400 });
// file.dropIndexes({ createdAt: 1 });
// file.collection.dropIndexes();

// console.log(file.getIndexes());
// file
//   .deleteMany({})
//   .then(() => console.log("all deleted "))
//   .catch((err) => console.log("err"));
dotenv.config();
// const path = r
app.get("/", (req, res) => {
  //   console.log("hi");
  res.render("index");
});
let ind = 0;
// app.set('view')
app.use(express.static("views"));
app.use(express.static("public"));
app.set("view engine", "ejs");
const cors = require("cors");
// app.set("views", path.join(__dirname, "/views"));

let i = 1;
// setInterval(() => {
//   console.log(" delay of 3sec", i++);
// }, 3000);
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/db");
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};
// connectDB();

// file
//   .deleteMany({})
//   .then(() => console.log("all deleted "))
//   .catch((err) => console.log("err"));

// const connectDB = require("./config/db");
// connectDB();
async function fetchData() {
  //  24 hrs old file and delete it
  await connectDB();
  // const ans1 = await file.collection.dropIndexes();
  // console.log("ans1", ans1);
  // const ans2 = await file.collection.getIndexes();
  // console.log("ans2", ans2);
  const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
  //    the inner one is i millis
  console.log(pastDate);
  const files = await file.find({ createdAt: { $lt: pastDate } });
  console.log(files);
  if (files.length > 0) {
    console.log(files);
    for (const entry of files) {
      try {
        await fs.unlinkSync(`uploads/enc${entry.filename}`);
        // it will remove from uploads folder

        // await entry.remove();
        await file.deleteOne({ uuid: entry.uuid });
        console.log("deleted file successfully ");
      } catch (err) {
        console.log("Error while deleting file", err);
      }
    }
  }
  console.log("job done ");
}

fetchData();
// .then(() => {
//   // process.exit();
// });

// app.post("/login", (res, res) => {
//   console.log("hi");
// });
// app.use(cors());
app.use(express.json());
app.use(cors(corsOptions));

// app.post("/api/filters", (req, res) => {
//   console.log(req.body);
//   res.json({ file: `link${ind++}` });
//   console.log("insode post ");
// });

// app.post("/api/files", (req, res) => {
//   console.log("email---", req.body);
//   res.json({ key1: `mail number ${ind} send successfully` });
// });
// app.post("/", (req, res) => {
//   console.log("hi");
// });

// Routes  ,   REQUIREING THE ROUTES ISS LIKE ONWE WAY OF IPORTING THEM ONLY
app.use("/files", require("./routes/show"));
//  this will take me to downloads
app.use("/api/files", require("./routes/files"));
// this will help to save in multer
app.use("/files/download", require("./routes/download"));
// this will help me in downloads
app.listen(PORT, () => console.log("Server started on port 3000 "));
