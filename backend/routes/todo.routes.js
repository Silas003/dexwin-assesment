import express from "express";
import Todo from "../models/todo.model.js";

const router = express.Router();

// get all todos
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get a todo by id
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// create a todo
router.post("/", async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update a todo
router.patch("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (req.body.title !==  undefined) {
            todo.text = req.body.text;
        }
        if (req.body.completed !==  undefined) {
            todo.completed = req.body.completed;
        }
        const updatedtodo=await todo.save();
        res.status(200).json(updatedtodo);
        }
     catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete a todo
router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;