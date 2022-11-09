const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  let token =
    req.body.token ||
    req.query.token ||
    req.header("x-auth-token") ||
    req.headers["authorization"];

  if (req.headers["authorization"]) {
    const bearer = token.split(" ");
    token = bearer[1];
  }
  if (!token) return res.status(401).json({ msg: "No Permission" });

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "The token used has expired", e});
  }
}

module.exports = auth;
