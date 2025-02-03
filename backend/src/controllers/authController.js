const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authController = {
  async register(req, res) {
    try {
      const { email, password, full_name } = req.body;
      
      // Check if user exists
      const userExists = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      
      // Create user
      const result = await db.query(
        'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
        [email, password_hash, full_name]
      );
      
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = result.rows[0];
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      
      delete user.password_hash;
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = authController;
