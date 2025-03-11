import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
const router = express.Router();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    const allUsers = await prisma.users.findMany();
    res.send(allUsers).status(200);
});

export default router;
