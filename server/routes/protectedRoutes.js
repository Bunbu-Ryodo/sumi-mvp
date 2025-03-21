import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js"

const router = express.Router();
const prisma = new PrismaClient();


router.get("/users", authMiddleware, async (req, res) => {
  const { userId } = req.query;
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        id: userId
      }
    })

    res.status(200).json(foundUser)
  } catch(error) {
    console.error("Error fetching user:", error);
    res.status(500).json({error: "Internal server error"})
  }
})

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

router.get("/ereader", authMiddleware, async (req, res) => {

  const { id } = req.query;

  if(!id){
    return res.status(400).json({ error: "Missing id parameter" });
  }
  try {
    const extract = await prisma.extract.findUnique({
      where: {
        id:  id.toString() 
      }
    })

    if (!extract) {
      return res.status(404).json({ error: "Extract not found" });
    }

    res.status(200).json(extract);
  } catch(error){
    console.error("Error fetching extracts:", error);
    res.status(500).json({error: "Internal server error"})
  }
})

router.post("/comment", authMiddleware, async(req, res) => {
  const { userId, message, extractId, time, readerTag } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        userId,
        extractId,
        message,
        time,
        readerTag
      }
    })

    if(!newComment){
      return res.status(404).json({error: "Error posting comment"})
    }

    res.status(200).json(newComment);
  } catch(error){
    console.error("Error posting comment:", error);
    res.status(500).json({error: "Internal server error"})
  }
})

router.get("/comment", authMiddleware, async(req, res) => {
  const { extractId } = req.query

  if(!extractId){
    return res.status(400).json(({error: "Missing Extract ID"}))
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        extractId: extractId
      }
    })

    if (!comments) {
      return res.status(404).json({ error: "Comments" });
    }

    res.status(200).json(comments);

  } catch(error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({error: "Internal server error"})
  }
})

router.post("/deletecomment", authMiddleware, async(req, res) => {
  const { id, userId } = req.body;

  if(!id || !userId){
    return res.status(400).json({error: "Missing data"});
  }

  try {
    const comment = await prisma.comment.delete({
      where: { id: id, userId: userId }
    })

    if (!comment) {
      return res.status(404).json({ error: "Comments" });
    }

    res.status(200).json(comment);
  } catch(error){
     console.error("Error deleting comment:", error);
     res.status(500).json({error: "Internal server error"});
  }
})

router.post("/editcomment", authMiddleware, async(req, res) => {
  const {id, userId, comment } = req.body;

  if(!id || !userId || !comment){
    return res.status(400).json({error: "Missing data"});
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: id,
        userId: userId
      },
      data: {
        message: comment
      }
    })

    if(!updatedComment){
      return res.status(500).json({error: "Something went wrong updating the comment"});
    }

    res.status(200).json(updatedComment);
  } catch(error) {
    console.error("Error updating comment:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

router.post("/likecomment", authMiddleware, async(req, res) => {
  const { id } = req.body;

  if(!id){
    return res.status(400).json({error: "Missing data"});
  }

  try {
    const likedComment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        likes: {
          increment: 1
        }
      }
    })

    if(!likedComment){
      return res.status(500).json({error: "Something went wrong with liking the comment"});
    }

    res.status(200).json(likedComment);
  } catch(error) {
    console.error("Error liking comment:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

router.post("/undolikecomment", authMiddleware, async(req, res) => {
  const { id } = req.body;

  if(!id){
    return res.status(400).json({error: "Missing data"});
  }

  try {
    const likedComment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        likes: {
          decrement: 1
        }
      }
    })

    if(!likedComment){
      return res.status(500).json({error: "Something went wrong with liking the comment"});
    }

    res.status(200).json(likedComment);
  } catch(error) {
    console.error("Error liking comment:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

export default router;