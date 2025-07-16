const express = require("express");
const router = express.Router();
const { db } = require("../db");

//Get all students
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM Students ORDER BY createdAt DESC"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Students where id=@id", {
      id: { type: db.Int, value: req.params.id },
    });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST new student
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.query(
      `
        INSERT INTO Students (name, email) VALUES (@name, @email)
      `,
      {
        name: { type: db.NVarChar, value: name },
        email: { type: db.NVarChar, value: email },
      }
    );
    res.status(201).json({ message: "Student created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.query(
      `
        UPDATE Students SET name = @name, email = @email WHERE id = @id
      `,
      {
        id: { type: db.Int, value: req.params.id },
        name: { type: db.NVarChar, value: name },
        email: { type: db.NVarChar, value: email },
      }
    );
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM Students WHERE id = @id", {
      id: { type: db.Int, value: req.params.id },
    });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
