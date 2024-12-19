const jwtGenerator = require("../utils/jwt");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      errorMessage: "Only authenticated Users can access this resource",
    });
  }
  try {
    const verifiedWithoutExpiry = jwtGenerator.vertifyAccessToken(token, true);
    if (
      !verifiedWithoutExpiry ||
      !verifiedWithoutExpiry.ID ||
      !verifiedWithoutExpiry.exp
    ) {
      return res.status(401).send({ errorMessage: "Invalid Token" });
    }

    let isTokenExpired = true;
    try {
      const verified = jwtGenerator.vertifyAccessToken(token);
      isTokenExpired = false;
    } catch (err) {
      console.log(err);
    }

    if (isTokenExpired) {
      return res.status(401).send({ errorMessage: "Token Expired" });
    }

    const { ID } = verifiedWithoutExpiry;
    if (!ID || ID <= 0) {
      return res.status(401).json({ errorMessage: "Unauthorized Access." });
    }

    req.user = verifiedWithoutExpiry;
  } catch (err) {
    console.log(err);
    return res.status(401).send({ errorMessage: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
