import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/shareextractpublic", async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Missing ID" });
    } 

    try {
        const extract = await prisma.extract.findUnique({
            where: { id: id.toString() },
        });

        
    if (!extract) {
        return res.status(404).json({ error: "Extract not found" });
      }

     return res.status(200).json(extract);
    } catch(error){
        console.error("Error fetching extract:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

export default router;