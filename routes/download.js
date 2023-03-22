const router = require("express").Router();

const file = require("../models/file");
//  so, basically this file is the coolection containing the various file entries

router.get("/:uuid", async (req, res) => {
  console.log("The uuid is ", req.params.uuid);
  const fileD = await file.findOne({ uuid: req.params.uuid });
  if (!fileD) {
    return res.render("download", { error: "link has been epired " });
  }

  const filePath = `${__dirname}/../${fileD.path}`;

  //    downloading the file
  res.download(filePath);
});

module.exports = router;
