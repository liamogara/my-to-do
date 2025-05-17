# MyToDo Application

## 📝 Overview

MyToDo is a full-featured to-do list web application built with **Node.js**, **Express**, **SQLite**, and **Pug**. It supports user authentication, task management, filtering by status, detailed task descriptions, and user-added comments — all within a session-based system.

## ✨ Features

* 👤 User Authentication (Log In / Log Out / Create / Delete Account)
* 📋 Add, edit, and delete tasks
* ✅ Filter tasks by status (`New`, `Active`, `Done`)
* 📝 Add and edit descriptions for tasks
* 💬 Add and delete comments per task
* 🔒 Session-based security
* 🧱 SQLite used for persistent storage
* 🖼️ Pug templates for all HTML pages

## 🌐 Routes

### Public Routes

| Method | Route          | Description              |
| ------ | -------------- | ------------------------ |
| GET    | `/login`       | Render login page        |
| POST   | `/login`       | Handle user login        |
| GET    | `/create-user` | Render create user page  |
| POST   | `/create-user` | Handle user registration |

### Authenticated Routes (Require Login)

| Method | Route                 | Description                                 |
| ------ | --------------------- | ------------------------------------------- |
| GET    | `/`                   | Redirect to `/todo`                         |
| GET    | `/logout`             | Log out and destroy session                 |
| GET    | `/todo`               | Render main to-do list page                 |
| GET    | `/todolist`           | Fetch tasks (with optional filter)          |
| GET    | `/add-task`           | Render page to add a new task               |
| POST   | `/add-task`           | Submit a new task                           |
| DELETE | `/delete-task`        | Delete a task and its associated comments   |
| GET    | `/task-details/:id`   | View details for a specific task            |
| POST   | `/update-status`      | Update a task's status                      |
| POST   | `/update-description` | Update a task's description                 |
| GET    | `/comments`           | Get comments for a specific task            |
| POST   | `/add-comment`        | Add a comment to a task                     |
| DELETE | `/delete-comment`     | Delete a specific comment                   |
| GET    | `/user-settings`      | Render user settings page                   |
| GET    | `/delete-user`        | Render user delete confirmation page        |
| DELETE | `/delete-user`        | Delete user account and all associated data |

## 🚀 Getting Started

### 🔧 Prerequisites

* [Node.js](https://nodejs.org/) installed
* `npm` (comes with Node)
* [SQLite3](https://www.sqlite.org/index.html) (optional if shipping with a starter `.db` file)

### 🛠️ Setup Instructions

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/mytodo-app.git
   cd mytodo-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your session secret:

   ```
   SESSION_SECRET=yourStrongSecretKey
   ```

4. (Optional) If using a starter database, rename it to `myToDo.db` or adjust the filename in `server.js`.

5. Start the server:

   ```bash
   node server.js
   ```

6. Open your browser and navigate to:

   ```
   http://localhost:7001/
   ```

## 📁 Project Structure

```
.
├── static/               # CSS, client-side JS, and images
├── views/                # Pug templates
├── server.js             # Main Express app
├── myToDo.db             # SQLite database (excluded or template)
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore rules
```

## 🔒 Security Notes

* Do **not** commit your `.env` file or production database.
* If deploying this app publicly, use HTTPS and production-ready configurations.

## 🧪 Future Improvements (Optional)

* User email verification
* Dark mode toggle
* Task prioritization or categories
* Full mobile responsiveness

## 🐛 Bugs or Suggestions?

Open an [issue](https://github.com/your-username/mytodo-app/issues) or submit a pull request!

## 📜 License

MIT License. Feel free to modify and use this app for learning or personal projects.
