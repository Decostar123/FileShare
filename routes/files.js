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
  console.log("!!!!!!!!!!!!!!!!2", req.file);
  upload(req, res, async (err) => {
    // validate request
    // console.log
    console.log("!!!!!!!!!!!!!!!!1", req.file);
    if (!req.file) {
      console.log("1111111111111111");
      res.json({ error: "All fields are requird" });
    } else if (err) {
      // return res.status(500).send({ error: err.message });
      console.log("222222222222222");
      return res.send({ error: err.message });
    }
    //  I THINK ERROR HAS NOT COME NOW YOU CAN SOTRR IT INTO THE DATABASES
    // STore into database
    //  the model and the collection is made inside models/files
    else {
      const file = new File({
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size,
      });
      const response = await file.save();

      console.log(" I hae successfully sved the file ");
      return res.json({
        file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
        // http://localhost:3000/files/uuid
      });
    }
  });

  // response will have download link
});

router.post("/send", async (req, res) => {
  //  Validate request
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required" });
  }
  // Get data from database
  const file = await File.findOne({ uuid: uuid });
  // if senfer exist than it means that it alreay has been sent

  if (file.sender) {
    return res.status(422).send({ error: "Mail aready sent" });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send Email
  // I will make a seprate module for senfding the email
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Easy File Sharing ",
    text: `${emailFrom} shared a file with you `,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  return res.send({ success: true });
});

module.exports = router;
