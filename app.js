const express = require("express");
const app = express();
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

// Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.listen(PORT, () => console.log("Server started on port 3000 "));
