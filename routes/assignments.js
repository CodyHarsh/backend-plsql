const express = require('express');
const { Pool } = require('pg');
const authenticateJWT = require('../middleware/authenticate');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware for request body validation
const validateAssignment = (req, res, next) => {
    const { title, description, due_date, max_score } = req.body;
    const errors = [];

    if (!title) errors.push('title is missing');
    if (title && typeof title !== 'string') errors.push('title must be a string');

    if (!description) errors.push('description is missing');
    if (description && typeof description !== 'string') errors.push('description must be a string');

    if (!due_date) errors.push('due_date is missing');
    if (due_date && isNaN(Date.parse(due_date))) errors.push('due_date must be a valid date');

    if (!max_score) errors.push('max_score is missing');
    if (max_score && typeof max_score !== 'number') errors.push('max_score must be a number');

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    next();
};

// Create new assignment
router.post('/', authenticateJWT, validateAssignment, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, due_date, max_score } = req.body;
    const teacher_id = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO assignments (teacher_id, title, description, due_date, max_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [teacher_id, title, description, due_date, max_score]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all assignments
router.get('/', authenticateJWT, async (req, res) => {
    const { role, id } = req.user;
    let assignments;

    try {
        if (role === 'teacher') {
            assignments = await pool.query('SELECT * FROM assignments WHERE teacher_id = $1', [id]);
        } else {
            assignments = await pool.query('SELECT * FROM assignments');
        }
        res.json(assignments.rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update assignment
router.put('/:id', authenticateJWT, validateAssignment, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const teacher_id = req.user.id;
    const { id } = req.params;
    const { title, description, due_date, max_score } = req.body;

    try {
        const assignment = await pool.query('SELECT * FROM assignments WHERE id = $1 AND teacher_id = $2', [id, teacher_id]);
        if (assignment.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        await pool.query(
            'UPDATE assignments SET title = $1, description = $2, due_date = $3, max_score = $4 WHERE id = $5',
            [title, description, due_date, max_score, id]
        );

        res.json({ message: 'Assignment updated successfully' });
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete assignment
router.delete('/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const teacher_id = req.user.id;
    const { id } = req.params;

    try {
        const assignment = await pool.query('SELECT * FROM assignments WHERE id = $1 AND teacher_id = $2', [id, teacher_id]);
        if (assignment.rows.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
