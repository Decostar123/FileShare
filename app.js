const express = require("express");
const app = express();
const dotenv = require("dotenv");
const file = require("./models/file");
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
connectDB();

// app.post("/login", (res, res) => {
//   console.log("hi");
// });
// app.use(cors());
app.use(express.json());

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
