# Deployment Guide

  This guide explains how to deploy DevOps Command Center to an AWS EC2 server using Docker Compose.

  ## Current Stack

  - React frontend served by Nginx
  - Node.js Express backend
  - PostgreSQL database
  - Docker Compose for local and server orchestration

  ## EC2 Requirements

  Recommended starting server:

  - Ubuntu 22.04 or 24.04
  - t2.micro or t3.micro for learning/testing
  - At least 8 GB disk
  - Security group allowing:
    - SSH: port 22
    - HTTP: port 80
    - HTTPS: port 443
    - Temporary testing ports if needed:
      - Frontend: port 5173
      - Backend: port 4000

  ## Server Setup

  Update packages:

  ```bash
  sudo apt update
  sudo apt upgrade -y

  Install Docker:

  sudo apt install -y docker.io docker-compose-v2
  sudo systemctl enable docker
  sudo systemctl start docker

  Allow your user to run Docker:

  sudo usermod -aG docker $USER

  Log out and log back in after running that command.

  Confirm Docker works:

  docker --version
  docker compose version

  ## Clone The App

  git clone git@github.com:s12samayo/-DevOps-command-center.git
  cd -DevOps-command-center

  If SSH is not configured on the server, use HTTPS instead:

  git clone https://github.com/s12samayo/-DevOps-command-center.git
  cd -DevOps-command-center

  ## Environment Variables

  The current Docker Compose file includes learning-friendly default values.

  Before production use, replace these values with stronger secrets:

  POSTGRES_DB: devops_command_center
  POSTGRES_USER: devops_user
  POSTGRES_PASSWORD: devops_password
  DB_NAME: devops_command_center
  DB_USER: devops_user
  DB_PASSWORD: devops_password

  Recommended future improvement:

  - Move secrets into a .env file
  - Do not commit real production secrets to GitHub

  ## Start The App

  Build and start containers:

  docker compose up --build -d

  Check running services:

  docker compose ps

  View logs:

  docker compose logs backend
  docker compose logs frontend
  docker compose logs database

  ## Test The App

  Backend health check:

  curl http://localhost:4000/health

  Frontend test from browser:

  http://SERVER_PUBLIC_IP:5173

  Backend test from browser:

  http://SERVER_PUBLIC_IP:4000/health

  ## Nginx Reverse Proxy Plan

  For production, the app should eventually be served through Nginx on standard ports.

  Target public URLs:

  http://SERVER_PUBLIC_IP
  http://SERVER_PUBLIC_IP/api

  Planned routing:

  - / routes to the frontend container
  - /api routes to the backend container
  - /health routes to the backend health check

  Future Nginx tasks:

  - Install Nginx on EC2 or add an Nginx reverse proxy container
  - Route frontend traffic through port 80
  - Route API traffic to the backend
  - Add HTTPS with Certbot and Let's Encrypt

  ## Useful Docker Commands

  Stop the app:

  docker compose down

  Restart the app:

  docker compose up --build -d

  View all logs:

  docker compose logs -f

  Rebuild after code changes:

  docker compose up --build -d

  ## Production Checklist

  Before calling this production-ready:

  - GitHub Actions CI passes
  - Strong database password is configured
  - Secrets are moved out of docker-compose.yml
  - Nginx reverse proxy is configured
  - HTTPS is enabled
  - EC2 security group exposes only needed ports
  - PostgreSQL data backup plan exists
  - Deployment steps have been tested from a fresh clone
