require("dotenv").config();
const router = require("express").Router();

const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const encrypt = require("../node-encryption/encrypt");
// const decrypt = require("../node-encryption/decrypt");
const { v4: uuid4 } = require("uuid");

let uniqueName = "";
// const {
//   scryptSync,
//   createDecipheriv,
//   createCipheriv,
//   crypto,
// } = require("crypto");
const password = "decoKaStar";
// const algorithm = "aes-192-cbc";
// let key = "MySecretKey";
// let key = crypto
//   .createHash("sha256")
//   .update(String(secret))
//   .digest("base64")
//   .substr(0, 32);
// const key = Buffer.from("shezhuansauce", "base64");
// let iv = Buffer.alloc(16, 0);

// let key = scryptSync(password, "salt", 24);
// let iv = Buffer.alloc(16, 0);
// const fs = require("fs");
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  //   null , uploads -> error, destination
  filename: (req, file, cb) => {
    // I have to make sure that the file name is always unique
    uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    console.log("uniqueName", uniqueName);
    const name = `${uniqueName}${path.extname(file.originalname)}`;
    cb(null, name);
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
      console.log(
        "fffiiillleee",
        req.file.filename,
        req.file.path,
        req.file.size
      );
      // const srcPath = `uploads/${uniqueName}`;

      // const destPath =
      //   "uploads/" +
      //   `${Date.now()}-${Math.round(Math.random() * 1e9)}hi1${path.extname(
      //     req.file.originalname
      //   )}`;
      // const DestPath =
      //   "uploads/" +
      //   `${Date.now()}-${Math.round(Math.random() * 1e9)}hi2${path.extname(
      //     req.file.originalname
      //   )}`;

      // console.log(srcPath, destPath);
      // const done = encrypt(srcPath, destPath, algorithm, key, iv);
      // if (done) decrypt(destPath, DestPath, algorithm, key, iv);
      const file = "uploads/" + uniqueName + ".pdf";
      console.log(file);
      encrypt({ file, password, uniqueName });
      const files = new File({
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size,
        uniquename: uniqueName,
      });
      const response = await files.save();

      console.log(" I hae successfully sved the file ");
      return res.json({
        file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
        // http://localhost:3000/files/uuid
      });
    }
  });

  // response will have download link
});

// const encrypt = (filePath, output, algorithm, key, iv) => {
//   const fileStream = fs.createReadStream(filePath);
//   const outputFileStream = fs.createWriteStream(output);

//   const cipher = createCipheriv(algorithm, key, iv);
//   let encrypted = "";

//   fileStream.on("data", (data) => {
//     encrypted = cipher.update(data);
//     console.log(encrypted);
//     fs.appendFile(output, encrypted, () => {});
//     // outputFileStream.write(encrypted);
//   });
//   fileStream.on("end", () => {
//     outputFileStream.end();
//   });
//   return true;
// };

// const decrypt = (inputFilePath, outputFilePath, algorithm, key, iv) => {
//   const outputWriteStream = fs.createWriteStream(outputFilePath);
//   const inputReadStream = fs.createReadStream(inputFilePath);

//   const decipher = createDecipheriv(algorithm, key, iv);
//   let decrypted = "";
//   inputReadStream.on("data", (data) => {
//     decrypted = decipher.update(data);

//     fs.appendFile(outputFilePath, decrypted, () => {});
//     // outputWriteStream.write(decrypted);
//   });
//   inputReadStream.on("end", () => {
//     outputWriteStream.end();
//   });
// };

// const e

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
