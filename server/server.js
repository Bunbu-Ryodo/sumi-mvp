import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 50;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", users);

app.listen(PORT, () => {
    console.log(`Server listening  on port ${PORT}`);
})