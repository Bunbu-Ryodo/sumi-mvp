import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js"

const router = express.Router();
const prisma = new PrismaClient();

router.get("/feed", authMiddleware, async (req, res) => {
    try {
      const chapter1Extracts = await prisma.extract.findMany({
        where: {
          chapter: {
            equals: 1,
          },
        },
      });
  
      res.status(200).json(chapter1Extracts);
    } catch (error) {
      console.error("Error fetching extracts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

export default router;