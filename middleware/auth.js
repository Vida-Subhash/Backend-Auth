const jwt = require("jsonwebtoken");

// modal is optional

const auth = (req, res, next) => {
    console.log("cookies", req.cookies);
  const token =
    req.header("Authorization") || req.cookies.token || req.body.token;
  if (!token) {
    return res.status(401).send("Token is required");
  }
 
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("decode", decode);
  } catch (error) {
    console.log("error", error);
    return res.status(401).send("Invalid token");
  }

  return next();
};

module.exports = auth;
