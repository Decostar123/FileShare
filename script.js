const File = require("./modules/file");

const fs = require("fs");
const connectDB = require("./config/db");
connectDB();
async function fetchData() {
  //  24 hrs old file and delete it
  const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
  //    the inner one is i millis
  const files = File.find({ createdAt: { $lt: pastDate } });

  if (files.length > 0) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        // it will remove from uploads folder

        await file.remove();
        console.log("deleted file successfully ");
      } catch (err) {
        console.log("Error while deleting file", err);
      }
    }
  }
  console.log("job done ");
}

fetchData().then(() => {
  process.exit();
});
