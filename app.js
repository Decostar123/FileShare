const express = require("express");
const app = express();
app.get("/", (req, res) => {
  //   console.log("hi");
  res.render("index");
});
let ind = 0;
// app.set('view')
app.use(express.static("views"));
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 5000;

// app.post("/login", (res, res) => {
//   console.log("hi");
// });
// app.use(cors());
app.use(express.json());

app.post("/api/filters", (req, res) => {
  console.log(req.body);
  res.json({ file: `link${ind++}` });
  console.log("insode post ");
});

app.post("/api/files", (req, res) => {
  console.log("email---", req.body);
  res.json({ key1: `mail number ${ind} send successfully` });
});
app.post("/", (req, res) => {
  console.log("hi");
});
app.listen(3000, () => console.log("Server started on port 3000 "));
