const router = require("express").Router();
const File = require("../models/file");
const fs = require("fs");

router.get("/:uuid", async (req, res) => {
  // /; means dynamic parametr I have
  const name = req.params.uuid;

  try {
    // const file = await File.findOne({ uuid: req.params.uuid });
    const file = await File.findOne({ filename: name });

    console.log("//////////", name);
    console.log("((((((((((", file);
    if (!file) {
      // const uniquename = file.uniquename;
      // const extension = file.filename.split(".")[1];
      const file_path = `uploads/enc${name}`;
      fs.unlinkSync(file_path);
      console.log("hi the path is ");
      return res.render("download", { error: "Link has expired ---- " });
    } else {
      console.log("---------------------------------------");
      return res.render("download", {
        uuid: file.uuid,
        fileName: file.filename,
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.filename}`,
        password: file.password,
      });
    }
  } catch (err) {
    const file_path = `uploads/enc${name}`;
    fs.unlinkSync(file_path);
    return res.render("download", { error: "Something went wrong" });
  }
});
module.exports = router;
