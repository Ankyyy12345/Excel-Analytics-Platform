import jwt from "jsonwebtoken";

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data
    console.log(req.user)
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

};

export default authMiddleware;
