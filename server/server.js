import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protectedRoutes.js";
import shareRouter from "./routes/share.js";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 50;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/api", protectedRouter);
app.use("/share", shareRouter);

app.listen(PORT, () => {
    console.log(`Server listening  on port ${PORT}`);
})