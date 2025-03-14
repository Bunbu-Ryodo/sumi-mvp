import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual secret

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({error: "Invalid token."});
  }
};

export default authMiddleware;