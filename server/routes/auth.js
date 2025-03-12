import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js";

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { email, password, confirmPassword, readerTag } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({error: "Passwords do not match"});
  }
  
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({error: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          readerTag,
        },
      });

      res.status(201).json(newUser);
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await prisma.users.findUnique({ where: { email } });
  console.log(user, "User");
  const allUsers = await prisma.users.findMany();
  console.log(allUsers);


  if (!user) {
    return res.status(400).json({error: "Invalid email or password"});
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {

    return res.status(400).json({error: "Invalid email or password"});
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});



export default router;
