const express = require("express");
  const cors = require("cors");
  require("dotenv").config();

  const app = express();

  const PORT = process.env.PORT || 4000;

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "devops-command-center-api",
    });
  });

  app.get("/api/commands", (req, res) => {
    res.json([
      {
        id: 1,
        category: "Linux",
        command: "ls -la",
        description: "Lists all files in the current directory, including hidden files.",
      },
      {
        id: 2,
        category: "Git",
        command: "git status",
        description: "Shows the current state of your Git working directory.",
      },
      {
        id: 3,
        category: "Docker",
        command: "docker ps",
        description: "Shows running Docker containers.",
      },
    ]);
  });

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });