import express from "express";
import { connectDB } from "./config/db.js";
import todoRoutes from "./routes/todo.routes.js";
import cors from "cors";
const app = express();


app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use(express.json());
app.use(cors());
app.use("/api/todos/v1", todoRoutes);
app.listen(5000,()=>{
    connectDB();
    console.log("Server is running on localhost via: http://localhost:5000");
})