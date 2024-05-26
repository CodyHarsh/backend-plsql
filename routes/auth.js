const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const router = express.Router();
const secret = process.env.JWT_SECRET;

// Middleware for request body validation
const validateLogin = (req, res, next) => {
    const { username, password, role } = req.body;
    const errors = [];

    if (!username) errors.push('username is missing');
    if (username && typeof username !== 'string') errors.push('username must be a string');

    if (!password) errors.push('password is missing');
    if (password && typeof password !== 'string') errors.push('password must be a string');

    if (!role) errors.push('role is missing');
    if (role && (role !== 'teacher' && role !== 'student')) errors.push('role must be either "teacher" or "student"');

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    next();
};

const validateSignup = (req, res, next) => {
    const { username, password, role } = req.body;
    const errors = [];

    if (!username) errors.push('username is missing');
    if (username && typeof username !== 'string') errors.push('username must be a string');

    if (!password) errors.push('password is missing');
    if (password && typeof password !== 'string') errors.push('password must be a string');

    if (!role) errors.push('role is missing');
    if (role && (role !== 'teacher' && role !== 'student')) errors.push('role must be either "teacher" or "student"');

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    next();
};

// Login route
router.post('/login', validateLogin, async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userQuery = role === 'teacher' ? 'SELECT * FROM teachers WHERE username = $1' : 'SELECT * FROM students WHERE username = $1';
        const { rows } = await query(userQuery, [username]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role }, secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Signup route
router.post('/signup', validateSignup, async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userQuery = role === 'teacher' ? 'SELECT * FROM teachers WHERE username = $1' : 'SELECT * FROM students WHERE username = $1';
        const existingUser = await query(userQuery, [username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = role === 'teacher' ? 'INSERT INTO teachers (username, password) VALUES ($1, $2) RETURNING id' : 'INSERT INTO students (username, password) VALUES ($1, $2) RETURNING id';
        const result = await query(insertQuery, [username, hashedPassword]);

        const userId = result.rows[0].id;

        res.status(201).json({ message: 'User created successfully', id: userId });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
