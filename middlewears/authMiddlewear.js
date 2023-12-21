const jwt = require("jsonwebtoken");
const { secret } = require("../api/config")

const tokenVerifier = (req, res, next) => {
  const token = req.headers["authorization-token"];


  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userTokenCredentials = decodedToken;
    next();
  });
};

/*
const tokenAtacher = (req, res, next) => {
  const token = req.headers["authorization-token"];

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Error. Try again later!" });
      }
      req.userTokenCredentials = decodedToken;
      next();
    });
  } else {
    next()
  }
} */



module.exports = { tokenVerifier };