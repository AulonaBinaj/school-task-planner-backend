const express = require("express");
const router = express.Router();
const { sql } = require("../db");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Tasks");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET task by ID
router.get("/:id", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM Tasks WHERE id = ${req.params.id}`;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new task
router.post("/", async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  try {
    await sql.query`
      INSERT INTO Tasks (Title, Description,AssignedTo, DueDate)
      VALUES (${title}, ${description}, ${assignedTo}, ${dueDate})
    `;
    res.status(201).json({ message: "Task created successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (update) a task
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, assignedTo, description, dueDate, isCompleted } = req.body;

  try {
    await sql.query`
      UPDATE Tasks
      SET Title = ${title}, AssignedTo = ${assignedTo}, Description = ${description}, DueDate = ${dueDate}, IsCompleted = ${isCompleted}
      WHERE Id = ${id}
    `;
    res.json({ message: "Task updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM Tasks WHERE Id = ${id}`;
    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
