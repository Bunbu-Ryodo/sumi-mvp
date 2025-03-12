import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const allUsers = await prisma.users.findMany();
  res.send(allUsers).status(200);
});

export default router;