const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/tasks
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/tasks
router.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/tasks/:id/toggle
router.put('/:id/toggle', async (req, res) => {
    const { id } = req.params;
    try {
        const getResult = await pool.query('SELECT completed FROM tasks WHERE id = $1', [id]);
        if (getResult.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const currentState = getResult.rows[0].completed;
        const newState = !currentState;
        
        const updateResult = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [newState, id]
        );
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
