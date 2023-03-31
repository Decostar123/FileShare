const router = require("express").Router();

const files = require("../models/file");
const decrypt = require("../node-encryption/decrypt");
const password = "decoKaStar";
var waterfall = require("async-waterfall");
const download = require("download");
const fs = require("fs");
//  so, basically this file is the coolection containing the various file entries

router.get("/:uuid", async (req, res) => {
  console.log("The uuid is ", req.params.uuid);
  const fileD = await files.findOne({ filename: req.params.uuid });

  // const uniquename = fileD.filename;
  // const extension = fileD.filename.split(".")[1];
  const name = fileD.filename.split(".");
  const uniquename = name[0];
  const extension = name[1];
  const file = `uploads/enc${name[0]}.${name[1]}`;
  if (!fileD) {
    console.log("answer");
    await fs.unlinkSync(file);
    return res.render("download", { error: "link has been epired " });
  }

  // let filePath = `${__dirname}/../${fileD.path}`;
  // let filePath = `${__dirname}/../uploads/abcd.pdf`;

  // const file = filePath;
  // console.log("-----", file);
  // const result1 = await new Promise((resolve, reject) => {
  //   const ans = decrypt({ file, password, uniquename });
  //   if (ans) resolve();
  // });
  // const result = await
  let decrypted = false;
  // let dd = await decrypt({ file, password, uniquename, decrypted });
  // .then(() => {
  //   let filePath = `${__dirname}/../uploads/${uniquename}.pdf`;
  //   res.download(filePath);
  // });
  // while (!decrypted);
  // decrypt({ file, password, uniquename, decrypted }, function () {
  //   let filePath = `${__dirname}/../uploads/${uniquename}.pdf`;
  //   console.log(" I have decrypted it ", decrypted);
  // });
  // await decrypt({ file, password, uniquename, decrypted });

  // res.send("hi buddy ");
  // if (decrypted) {
  //   console.log("hi decrypted ");
  //   let filePath = `${__dirname}/../uploads/${uniquename}.pdf`;

  //   res.download(filePath);
  // }
  // console.log("333333333333333333333");
  let filePath = `${__dirname}/../uploads/${name[0]}.${name[1]}`;
  console.log("filePath--", filePath);
  // res.download(filePath);

  // console.log(result);
  //    downloading the file
  // decrypt({});
  // filePath += ".unenc";
  // res.send(fileD.uniquename);
  // res.send(result);
  // console.log("filePath", filePath);
  // let filePath = `${__dirname}/../uploads/${uniquename}.pdf`;
  // const result2 = await res.download(filePath);
  // console.log(result2);

  waterfall(
    [
      function (callback) {
        // --------------
        const crypto = require("crypto");

        const path = require("path");
        const zlib = require("zlib");

        const {
          ALGORITHM,
          ENCRYPED_EXT,
          UNENCRYPED_EXT,
        } = require("../node-encryption/constants");
        const { getCipherKey } = require("../node-encryption/util");

        const readPath = file;
        console.log(readPath);

        // First, get the initialization vector from the file.
        const readInitVect = fs.createReadStream(readPath, { end: 15 });

        let initVect;
        readInitVect.on("data", (chunk) => {
          initVect = chunk;
        });

        // Once we've got the initialization vector, we can decrypt the file.
        readInitVect.on("close", () => {
          const CIPHER_KEY = getCipherKey(password);

          const readStream = fs.createReadStream(readPath, { start: 16 });
          const decipher = crypto.createDecipheriv(
            ALGORITHM,
            CIPHER_KEY,
            initVect
          );
          const unzip = zlib.createUnzip();
          // const writeStream = fs.createWriteStream(path.join(file + UNENCRYPED_EXT));
          // const writeStream = fs.createWriteStream(path.join("uploads/abcd.pdf"));
          const writeStream = fs.createWriteStream(
            path.join(`uploads/${uniquename}.${extension}`)
          );

          writeStream.on("close", () => {
            console.log("Decryption success!");
            console.log(decrypted);
            decrypted = true;
            callback(null, "one", "two");
            console.log(decrypted);
          });

          readStream.pipe(decipher).pipe(unzip).pipe(writeStream);
          //  pipe will also automatically close the stream
        });

        // ---------------
      },
      function (arg1, arg2, callback) {
        // async function dld() {
        // setTimeout(() => {
        //   const fs = require("fs");
        //   fs.unlinkSync(`uploads/${uniquename}.${extension}`);
        // }, 1000 * 10);
        // const ans = res.download(filePath);
        // console.log(ans);
        // console.log("aaaaaaaaaa");
        // callback(null, "three");
        // }
        // dld();
        // const fs = require("fs");
        res.download(filePath, function (err) {
          fs.unlinkSync(`uploads/${uniquename}.${extension}`);
        });
      },
      // function (arg1, callback) {
      //   // arg1 now equals 'three'
      //   console.log("bbbbbbb");
      //   const fs = require("fs");
      //   fs.unlinkSync(`uploads/${uniquename}.pdf`);
      //   callback(null, "done");
      // },
    ],
    function (err, result) {
      // result now equals 'done'
    }
  );
});

module.exports = router;
