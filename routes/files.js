const router = require("express").Router();

const multer = require("multer");
const path = require("path");
const File = require("../models/file");

const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  //   null , uploads -> error, destination
  filename: (req, file, cb) => {
    // I have to make sure that the file name is always unique
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
let upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myFile");
//  single will have the name of the file which i send by the client
// name atttribute if the front end

router.post("/", (req, res) => {
  //STORE FILE
  //   multer is ready simply call the upload

  upload(req, res, async (err) => {
    // validate request
    // console.log
    if (!req.file) {
      res.json({ error: "All fields are requird" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //  I THINK ERROR HAS NOT COME NOW YOU CAN SOTRR IT INTO THE DATABASES
    // STore into database
    //  the model and the collection is made inside models/files
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
      // http://localhost:3000/files/uuid
    });
  });

  // response will have download link
});

module.exports = router;
