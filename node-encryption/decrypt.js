const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const { ALGORITHM, ENCRYPED_EXT, UNENCRYPED_EXT } = require("./constants");
const { getCipherKey } = require("./util");

async function decrypt({ file, password, uniquename, decrypted }) {
  // const readPath = path.join(file + ENCRYPED_EXT);
  // const readPath = path.join(file + ENCRYPED_EXT);
  // const readPath = "uploads/abc.pdf";
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
    const decipher = crypto.createDecipheriv(ALGORITHM, CIPHER_KEY, initVect);
    const unzip = zlib.createUnzip();
    // const writeStream = fs.createWriteStream(path.join(file + UNENCRYPED_EXT));
    // const writeStream = fs.createWriteStream(path.join("uploads/abcd.pdf"));
    const writeStream = fs.createWriteStream(
      path.join(`uploads/${uniquename}.pdf`)
    );

    writeStream.on("close", () => {
      console.log("Decryption success!");
      console.log(decrypted);
      decrypted = true;
      console.log(decrypted);
    });

    readStream.pipe(decipher).pipe(unzip).pipe(writeStream);
    //  pipe will also automatically close the stream
  });

  // return true;
}

module.exports = decrypt;
