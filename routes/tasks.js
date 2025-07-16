const express = require("express");
const router = express.Router();
const { db } = require("../db");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        t.Id,
        t.Title,
        t.Description,
        t.DueDate,
        t.IsCompleted,
        t.StudentId,
        s.Name AS studentName
      FROM Tasks t
      LEFT JOIN Students s ON t.StudentId = s.Id
      ORDER BY t.DueDate ASC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET task by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Tasks WHERE Id = @id", {
      id: { type: db.Int, value: req.params.id },
    });
    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new task
router.post("/", async (req, res) => {
  const { title, description, dueDate, isCompleted, studentId } = req.body;
  console.log("Received body:", req.body);

  if (!studentId) {
    return res.status(400).json({ message: "StudentId is required" });
  }

  try {
    const studentResult = await db.query(
      "SELECT Email FROM Students WHERE Id = @studentId",
      { studentId: { type: db.Int, value: studentId } }
    );

    if (studentResult.recordset.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assignedTo = studentResult.recordset[0].Email;

    await db.query(
      `
      INSERT INTO Tasks (Title, Description, DueDate, IsCompleted, StudentId, AssignedTo)
      VALUES (@title, @description, @dueDate, @isCompleted, @studentId, @assignedTo)
    `,
      {
        title: { type: db.NVarChar, value: title },
        description: { type: db.NVarChar, value: description },
        dueDate: { type: db.DateTime, value: dueDate },
        isCompleted: { type: db.Bit, value: isCompleted },
        studentId: { type: db.Int, value: studentId },
        assignedTo: { type: db.NVarChar, value: assignedTo },
      }
    );

    res.status(201).json({ message: "Task created" });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT (update) a task
router.put("/:id", async (req, res) => {
  const { title, description, studentId, dueDate, isCompleted } = req.body;
  const id = parseInt(req.params.id, 10);

  try {
    const studentResult = await db.query(
      "SELECT name FROM Students WHERE id = @studentId",
      { studentId: { type: db.Int, value: studentId } }
    );

    if (studentResult.recordset.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentName = studentResult.recordset[0].name;

    await db.query(
      `
      UPDATE Tasks
      SET
        Title = @title,
        Description = @description,
        DueDate = @dueDate,
        IsCompleted = @isCompleted,
        AssignedTo = @assignedTo,
        StudentId = @studentId
      WHERE Id = @id
    `,
      {
        title: { type: db.NVarChar, value: title },
        description: { type: db.NVarChar, value: description },
        dueDate: { type: db.DateTime, value: dueDate },
        isCompleted: { type: db.Bit, value: isCompleted },
        assignedTo: { type: db.NVarChar, value: studentName },
        studentId: { type: db.Int, value: studentId },
        id: { type: db.Int, value: id },
      }
    );

    res.json({ message: "Task updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM Tasks WHERE Id = @id", {
      id: { type: db.Int, value: id },
    });
    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
