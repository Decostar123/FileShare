const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const AppendInitVect = require("./appendInitVect");
const { ALGORITHM, ENCRYPED_EXT } = require("./constants");
const { getCipherKey } = require("./util");

async function encrypt({ file, password, uniqueName , extension}) {
  // Generate a secure, pseudo random initilization vector.
  const initVect = crypto.randomBytes(16);

  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);

  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  // const writeStream = fs.createWriteStream(path.join(file + ENCRYPED_EXT));
  // const writeStream = fs.createWriteStream(output) ;
  const writeStream = fs.createWriteStream(
    path.join(`uploads/enc${uniqueName}.${extension}`)
  );
  writeStream.on("close", () => {
    fs.unlinkSync(`uploads/${uniqueName}.${extension}`);

    console.log("Encryption success!");
  });

  readStream.pipe(gzip).pipe(cipher).pipe(appendInitVect).pipe(writeStream);
}

module.exports = encrypt;
