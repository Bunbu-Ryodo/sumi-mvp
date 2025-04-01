import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js"
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/users", async (req, res) => {
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

router.post("/editreadertag", async (req, res) => {
  const { id, readerTag } = req.body;

  console.log(id, "ID");

  try {
    const editUser = await prisma.users.update({
      where: {
        id: id
      },
      data: {
        readerTag: readerTag
      }
    })

    res.status(200).json(editUser);
  } catch(error) {
    console.error("Error fetching user:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

router.post("/editemail", async (req, res) => {
  const { userId, email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    })

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({error: "Invalid password"});
    }

    const changedEmailUser = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        email: email
      }
    })

    res.status(200).json(changedEmailUser);
  } catch(error) {
    console.error("Error fetching user:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

router.post("/changepassword", async(req, res) => {
  const { userId, oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    })

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if(!isMatch){
      return res.status(400).json({error: "Invalid password"});
    }

    if(newPassword !== confirmNewPassword){
      return res.status(400).json({error: "Passwords don't match"});
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const changedPasswordUser = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        password: hashedNewPassword
      }
    })

    res.status(200).json(changedPasswordUser)
  } catch(error) {
    res.status(500).json({error: "Internal server error"});
  }
})

router.get("/feed", async (req, res) => {
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

router.get("/ereader", async (req, res) => {

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

router.post("/comment", async(req, res) => {
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

router.get("/comment", async(req, res) => {
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

router.post("/deletecomment", async(req, res) => {
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

router.post("/editcomment", async(req, res) => {
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

router.post("/likecomment", async(req, res) => {
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

router.post("/undolikecomment", async(req, res) => {
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


router.get("/checksubscription", async(req, res) => {
  const { userId, textId } = req.query;

  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        textId: textId
      }
    })

    if(existingSubscription){
      return res.status(200).json(existingSubscription);
    }

    return res.status(200).json({message: "No subscription found"});
  } catch(error){
    console.error("Error checking subscription:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

router.post("/createsubscription", async(req, res) => {
  const { userId, textId, chapter, due } = req.body;

  if(!userId || !textId || !chapter || !due){
    return res.status(400).json({error: "Missing data"});
  }

  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        textId: textId
      }
    })

    if(existingSubscription){
      return res.status(400).json({error: "You're already subscribed"})
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: userId,
        textId: textId,
        chapter: chapter,
        due: due
      }
    })

    if(!newSubscription){
      return res.status(500).json({error: "Something went wrong with creating the subscription"})
    }
    return res.status(200).json(newSubscription);
  } catch(error){
    console.error("Error creating subscription:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

router.post("/deletesubscription", async(req, res) => {
  const { userId, textId } = req.body;

  if(!userId || !textId){
    return res.status(400).json({error: "Missing data"});
  }

  try {
    const deletedSubscription = await prisma.subscription.deleteMany({
      where: {
        userId: userId,
        textId: textId,
      }
    })

    const deletedInstalments = await prisma.instalment.deleteMany({
      where: {
        userId: userId,
        textId: textId
      }
    })

    if(!deletedSubscription || !deletedInstalments){
      return res.status(500).json({error: "Something went wrong with deleting the subscription"})
    }

    return res.status(200).json({deletedSubscription: deletedSubscription, deletedInstalments: deletedInstalments});
  } catch(error){
    console.error("Error creating subscription:", error);
    res.status(500).json({error: "Internal server error"});
  }
}),

router.get("/getsubscriptions", async(req, res) => {
  const { userId } = req.query;

  if(!userId){
    return res.status(400).json({error: "Missing user id"});
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: userId
      }
    })

    if(!subscriptions){
      return res.status(500).json({error: "Something went wrong with getting the subsriptions"})
    }

    return res.status(200).json(subscriptions)
  } catch(error){
    console.log("Error:", error);
    return res.status(500).json({error: "Internal server error"});
  }
}),

router.post("/createinstalments", async(req, res) => {
  const { dueInstalments } = req.body;

  if(!dueInstalments.length){
    return res.status(400).json({error: "Missing data"})
  }

  try {
    const instalmentsToProcess = [];

    for(let i = 0; i < dueInstalments.length; i++){
      
      const extract = await prisma.extract.findFirst({
        where: {
          textId: dueInstalments[i].textId,
          chapter: dueInstalments[i].chapter
        }
      })

      if(!extract){
        return res.status(400).json({error: "Cannot find the extract"});
      }

      const instalmentToProcess = {
        extractId: extract.id,
        userId: dueInstalments[i].userId,
        title: extract.title,
        textId: extract.textId,
        author: extract.author,
        subscribeArt: extract.subscribeArt
      }

      if(instalmentToProcess){
        instalmentsToProcess.push(instalmentToProcess);
      }

      await prisma.subscription.update({
        where: {
          id: dueInstalments[i].id
        },
        data: {
          chapter: {
            increment: 1
          },
          due: new Date(new Date().getTime() + 5 * 604800000)
        }
      })
    }

    const processedInstalments = await prisma.instalment.createMany({
      data: instalmentsToProcess
    })

    return res.status(200).json(processedInstalments);
  } catch(error) {
    console.error("Error:", error);
  }
}),

router.get("/getinstalments", async(req, res) => {
  const { userId } = req.query;

  if(!userId){
    return res.status(400).json({error: "Missing user id"});
  }

  try {
    const instalments = await prisma.instalment.findMany({
      where: {
        userId: userId
      }
    })

    if(!instalments){
      return res.status(500).json({error: "Something went wrong with getting the instalments"})
    }

    return res.status(200).json(instalments)
  } catch(error){
    console.log("Error:", error);
    return res.status(500).json({error: "Internal server error"});
  }
})

export default router;