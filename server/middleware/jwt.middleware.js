const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const bearer = req.headers.authorization;
  const token =
    (bearer && bearer.split(" ")[0]?.toLowerCase() === "bearer" && bearer.split(" ")[1]) ||
    req.cookies?.token;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ error: msg });
  }
}

module.exports = { authRequired };
