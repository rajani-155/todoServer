const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const TodoList = require('../models/todolist');

const handleErrorResponse = (err, res) => {
  console.error(err);
  res.status(500).send('Server Error');
};

const handleSuccessResponse = (message, data, res) => {
  res.json({ message, data });
};

// Protected route - GET profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userProfile = {
      username: req.user.username,
      email: req.user.email
    };
    handleSuccessResponse('Profile retrieved successfully', userProfile, res);
  } catch (err) {
    handleErrorResponse(err, res);
  }
});

// Protected route - POST a new todo
router.post('/todo', authMiddleware, async (req, res) => {
  try {
    const { title, content, status, deadline } = req.body;
    if (!title || !content || !status || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newTodo = new TodoList({
      title,
      content,
      status,
      deadline,
      author: req.user.id
    });
    await newTodo.save();
    handleSuccessResponse('Todo created successfully', newTodo, res);
  } catch (err) {
    handleErrorResponse(err, res);
  }
});

// Protected route - GET all todos
router.get('/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await TodoList.find().sort({ createdAt: -1 });
    handleSuccessResponse('Todos retrieved successfully', todos, res);
  } catch (err) {
    handleErrorResponse(err, res);
  }
});

// Protected route - GET a specific todo by ID
router.get('/todo/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoList.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    handleSuccessResponse('Todo retrieved successfully', todo, res);
  } catch (err) {
    handleErrorResponse(err, res);
  }
});

// Protected route - UPDATE a todo by ID
router.put('/todo/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, deadline } = req.body;
    if (!title || !content || !status || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const updatedTodo = await TodoList.findByIdAndUpdate(id, { title, content, status, deadline }, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    handleSuccessResponse('Todo updated successfully', updatedTodo, res);
  } catch (err) {
    handleErrorResponse(err, res);
  }
});

// Protected route - DELETE a todo by ID
router.delete('/todo/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await TodoList.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    handleSuccessResponse('Todo deleted successfully', deletedTodo, res);
  } catch (err) {
    handleErrorResponse(err, res);
  }
});

module.exports = router;