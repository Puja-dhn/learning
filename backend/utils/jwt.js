const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync(process.env.NODE_SSL_KEY);
const publicKey = fs.readFileSync(process.env.NODE_SSL_KEY_PUBLIC);

function generateAccessToken(tokenText) {
  return jwt.sign(tokenText, privateKey, {
    expiresIn: "1800s",
    algorithm: "RS256",
  });
}

function vertifyAccessToken(tokenText, ignoreExpiry = false) {
  return jwt.verify(tokenText, publicKey, {
    ignoreExpiration: ignoreExpiry,
    algorithms: ["RS256"],
  });
}

module.exports.generateAccessToken = generateAccessToken;
module.exports.vertifyAccessToken = vertifyAccessToken;
