const router = require("express").Router();

const files = require("../models/file");
const decrypt = require("../node-encryption/decrypt");
const password = "decoKaStar";
//  so, basically this file is the coolection containing the various file entries

router.get("/:uuid", async (req, res) => {
  console.log("The uuid is ", req.params.uuid);
  const fileD = await files.findOne({ uuid: req.params.uuid });
  const uniquename = fileD.uniquename;
  if (!fileD) {
    return res.render("download", { error: "link has been epired " });
  }

  // let filePath = `${__dirname}/../${fileD.path}`;
  // let filePath = `${__dirname}/../uploads/abcd.pdf`;

  const file = `uploads/enc${uniquename}.pdf`;
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
  decrypt({ file, password, uniquename, decrypted }, function () {
    let filePath = `${__dirname}/../uploads/${uniquename}.pdf`;
    console.log(" I have decrypted it ", decrypted);
  });
  res.send("hi buddy ");
  // if (decrypted) {
  //   console.log("hi decrypted ");
  //   let filePath = `${__dirname}/../uploads/${uniquename}.pdf`;

  //   res.download(filePath);
  // }

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
});

module.exports = router;
