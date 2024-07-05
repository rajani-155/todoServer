// models/todolist.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoListSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TodoList', TodoListSchema);
