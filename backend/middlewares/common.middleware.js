const { decryptData } = require("../utils/crypto");

const interceptReq = (req, res, next) => {
  const currConfigData = req.body;

  let decConfigData = {};
  let hasError = false;
  if (currConfigData) {
    try {
      Object.keys(currConfigData).forEach((key) => {
        if (key !== "refresh") {
          const decKey = decryptData(key);

          if (decKey === "encPayload") {
            const value = decryptData(currConfigData[key]);
            decConfigData = JSON.parse(value);

            Object.keys(decConfigData).forEach((dataKey) => {
              const dataValue = decConfigData[dataKey];
              // console.log(dataKey);
              decConfigData[dataKey] = dataValue;
              // if (
              //   dataKey !== "domainPassword" &&
              //   dataKey !== "emailId" &&
              //   dataKey !== "password" &&
              //   dataKey !== "domainId" &&
              //   dataKey !== "loginType" &&
              //   dataKey !== "scannedType" &&
              //   dataKey !== "EMAIL_ID" &&
              //   dataKey !== "PASSWORD"
              // ) {
              //   if (
              //     /(<([^>]+)>)/gi.test(dataValue) ||
              //     /['{}<>|=]/.test(dataValue)
              //   ) {
              //     hasError = true;
              //   } else {
              //     decConfigData[dataKey] = dataValue;
              //   }
              // } else {
              //   decConfigData[dataKey] = dataValue;
              // }
            });
          } else {
            hasError = true;
          }
        }
      });
      if (!hasError && Object.keys(decConfigData).length > 0) {
        req.body = decConfigData;
        // console.log(decConfigData);
      }
    } catch {
      hasError = true;
    }
  }
  if (hasError) {
    return res.status(400).json({
      errorMessage: "Invalid Data. Payload has been Tampered",
      errorTransKey: "api_res_unknown_error",
    });
  }

  return next();
};

module.exports = interceptReq;
