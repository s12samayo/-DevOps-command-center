const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 4000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "devops_command_center",
  user: process.env.DB_USER || "devops_user",
  password: process.env.DB_PASSWORD || "devops_password",
});

app.use(cors());
app.use(express.json());

async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS commands (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      command TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);

  const result = await pool.query("SELECT COUNT(*) FROM commands;");
  const count = Number(result.rows[0].count);

  if (count === 0) {
    await pool.query(`
      INSERT INTO commands (category, command, description)
      VALUES
        ('Linux', 'ls -la', 'Lists all files in the current directory, including hidden files.'),
        ('Git', 'git status', 'Shows the current state of your Git working directory.'),
        ('Docker', 'docker ps', 'Shows running Docker containers.');
    `);
  }
}

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      service: "devops-command-center-api",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      service: "devops-command-center-api",
      database: "disconnected",
      message: error.message,
    });
  }
});

app.get("/api/commands", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, category, command, description FROM commands ORDER BY id;"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load commands",
      error: error.message,
    });
  }
});

app.post("/api/commands", async (req, res) => {
  const { category, command, description } = req.body;

  if (!category || !command || !description) {
    return res.status(400).json({
      message: "Category, command, and description are required.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO commands (category, command, description)
       VALUES ($1, $2, $3)
       RETURNING id, category, command, description;`,
      [category, command, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create command",
      error: error.message,
    });
  }
});

app.delete("/api/commands/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM commands WHERE id = $1 RETURNING id;",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Command not found",
      });
    }

    res.json({
      message: "Command deleted",
      id: Number(id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete command",
      error: error.message,
    });
  }
});

app.put("/api/commands/:id", async (req, res) => {
  const { id } = req.params;
  const { category, command, description } = req.body;

  if (!category || !command || !description) {
    return res.status(400).json({
      message: "Category, command, and description are required.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE commands
       SET category = $1,
           command = $2,
           description = $3
       WHERE id = $4
       RETURNING id, category, command, description;`,
      [category, command, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Command not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update command",
      error: error.message,
    });
  }
});

setupDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to set up database", error);
    process.exit(1);
  });
