const express = require('express');
const { Pool } = require('pg');
const authenticateJWT = require('../middleware/authenticate');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware for request body validation
const validateSubmission = (req, res, next) => {
    const { assignment_id, submission_text } = req.body;
    const errors = [];

    if (!assignment_id) errors.push('assignment_id is missing');
    if (assignment_id && typeof assignment_id !== 'number') errors.push('assignment_id must be a number');

    if (!submission_text) errors.push('submission_text is missing');
    if (submission_text && typeof submission_text !== 'string') errors.push('submission_text must be a string');

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    next();
};

const validateGrade = (req, res, next) => {
    const { score } = req.body;
    const errors = [];

    if (score === undefined) errors.push('score is missing');
    if (score !== undefined && typeof score !== 'number') errors.push('score must be a number');

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    next();
};

// Submit assignment
router.post('/', authenticateJWT, validateSubmission, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { assignment_id, submission_text } = req.body;
    const student_id = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO submissions (assignment_id, student_id, submission_text) VALUES ($1, $2, $3) RETURNING *',
            [assignment_id, student_id, submission_text]
        );

        // Fetch the submission date and set the score to null
        const submissionDate = new Date().toISOString();
        const insertedSubmission = result.rows[0];
        const responseSubmission = {
            ...insertedSubmission,
            submission_date: submissionDate,
            score: null
        };

        res.status(201).json(responseSubmission);
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Grade submission
router.put('/:id', authenticateJWT, validateGrade, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const { score } = req.body;
    const teacher_id = req.user.id;

    try {
        const submission = await pool.query(
            'SELECT s.* FROM submissions s JOIN assignments a ON s.assignment_id = a.id WHERE s.id = $1 AND a.teacher_id = $2',
            [id, teacher_id]
        );

        if (submission.rows.length === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        await pool.query(
            'UPDATE submissions SET score = $1, graded = TRUE WHERE id = $2',
            [score, id]
        );

        res.json({ message: 'Submission graded successfully' });
    } catch (error) {
        console.error('Error grading submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all submissions
router.get('/', authenticateJWT, async (req, res) => {
    try {
        let query = 'SELECT * FROM submissions';

        // If the user is a student, only fetch their own submissions
        if (req.user.role === 'student') {
            query += ' WHERE student_id = $1';
            const { id: student_id } = req.user;
            const { rows } = await pool.query(query, [student_id]);
            return res.json(rows);
        }

        // If the user is a teacher, fetch all submissions
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
