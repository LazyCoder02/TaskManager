const db = require('../config/database');

const taskController = {
  async getTasks(req, res) {
    try {
      const result = await db.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  async createTask(req, res) {
    try {
      const { title, description, due_date } = req.body;
      const result = await db.query(
        'INSERT INTO tasks (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, title, description, due_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, due_date, status } = req.body;
      
      // Verify task ownership
      const taskExists = await db.query(
        'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
        [id, req.user.id]
      );
      
      if (taskExists.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      const result = await db.query(
        'UPDATE tasks SET title = $1, description = $2, due_date = $3, status = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
        [title, description, due_date, status, id, req.user.id]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      
      // Verify task ownership
      const result = await db.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = taskController;