import express from "express";
import session from "express-session";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import { formatDate, formatTime, } from './static/js/helpers.js';

dotenv.config();
const db = new sqlite3.Database('./myToDo.db');
const app = express()

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false}
));
app.use(express.static('static'));
app.use(express.static('static/html'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.set('views', 'views');
app.set('view engine', 'pug');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('../login');
  }
  next();
}

const port = 7001
app.listen(port, () => console.log('Listening on port: ' + port + '!'));

app.get('/', requireAuth, function (req, res) {
  res.redirect('../todo');
});

app.get('/login', function (req, res) {
  res.render("login");
});

app.post('/login', function (req, res) {
  if(req.session.user) {
    return res.redirect('../todo');
  } 
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(401).json(
      {error : "Missing username/password"}
    );
    return;
  }

  try {
    db.all('SELECT * FROM users WHERE username = ?', username, function (err, result) {
      console.log(result[0]);
      if (err) throw err;
      if (result.length > 0 && bcrypt.compareSync(password, result[0].password)) {
        req.session.regenerate((err) => {
          if (err) {
            return res.status(500).send("Error logging in.");
          }
          req.session.user = username;
          res.redirect(302, 'todo');
        });
      } else {
        res.status(401).json(
          {error : "Invalid username/password."}
        );
      }
    });
  }
  catch (ex) {
    res.status(400).send(ex.message);
  }
});

app.get('/logout', requireAuth, function (req, res) {
  console.log(req.session.user);
  if (req.session.user)
    req.session.destroy((err) => {
      if (err) 
        throw err;
      else {
        console.log ("Successfully Destroyed Session!");
        res.redirect(302, '/');
      }
    });
  else {
    console.log("Not logged in!");
    res.redirect(302, '/');
  }
})

app.get('/create-user', function (req, res) {
  res.render("create-user");
});

app.post('/create-user', (req, res) => {
  const username = req.body.username;
  const password = bcrypt.hashSync(req.body.password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err, result) {
    if (err) throw err;
    console.log("User created.");
  });

  res.redirect('login');
});

app.get('/user-settings', function (req, res) {
  res.render("user-settings");
});

app.get('/delete-user', requireAuth, (req, res) => {
  const userInfo = {
    username : req.session.user
  };
  res.render("delete-user", userInfo);
  });

app.delete('/delete-user', requireAuth, (req, res) => {
  const username = req.session.user
  db.run('DELETE FROM comments WHERE user = ?', username, function (err, result) {
    if (err) throw err;
    console.log("User comments deleted");
  });
  db.run('DELETE FROM todo WHERE user = ?', username, function (err, result) {
    if (err) throw err;
    console.log("User tasks deleted");
  });
  db.run('DELETE FROM users WHERE username = ?', username, function (err, result) {
    if (err) throw err;
    console.log("User deleted");
    if (req.session.user)
      req.session.destroy((err) => {
        if (err) 
          throw err;
        else {
          console.log ("Successfully Destroyed Session!");
          res.status(200).send();
        }
      });
  });
});

app.get('/todo', requireAuth, function (req, res) {
  res.render("todo");
});

app.get('/todolist', requireAuth, function (req, res) {
  const filter = req.query.filter;
  const user = req.session.user;
  var sql = `SELECT * FROM todo WHERE user = "${user}"`;

  if (filter != "") {
    console.log("Set filter: " + filter)
    sql = `SELECT * FROM todo WHERE status = "${filter}" AND user = "${user}"`
  }

  db.all(sql, function (err, rows) {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

app.get('/add-task', requireAuth, function (req, res) {
  res.render("add-task");
});

app.post('/add-task', requireAuth, (req, res) => {
  const postData = req.body;

  db.run('INSERT INTO todo(User, Task, Date, Time, Status, Description) VALUES (?, ?, ?, ?, ?, ?)', 
    [req.session.user, postData.task, postData.date, postData.time, "New", postData.description], function (err, result) {
    if (err) throw err;
    console.log("Values inserted");
    res.redirect('todo');
  });
});

app.delete('/delete-task', requireAuth, (req, res) => {
  const id = req.body.id;

  db.run('DELETE FROM comments WHERE taskId = ?', id, function (err, result) {
    if (err) throw err;
    console.log("Task comments deleted");
  });
  db.run('DELETE FROM todo WHERE id = ?', id, function (err, result) {
    if (err) throw err;
    console.log("Task deleted");
    res.status(200).send();
  });
});

app.get('/task-details/:id', requireAuth, (req, res) => {
  const taskId = req.params.id;
  console.log("Get id: " + taskId);

  db.all('SELECT * FROM todo WHERE id = ?', taskId, function (err, rows) {
    if (err) throw err;
    if (rows.length == 0)
      res.status(404).send(`Error getting task: no task exists with id "${taskId}"`);
    else {
      const taskInfo = {
        id : taskId,
        task : rows[0].task,
        date : formatDate(rows[0].date),
        time : formatTime(rows[0].time),
        status : rows[0].status,
        description : rows[0].description,
      };

      res.render("task-details", taskInfo);
    }
  });
  });

app.post('/update-status', requireAuth, (req, res) => {
  const taskId = req.body.id;
  const status = req.body.status;

  db.run(
          'UPDATE todo SET Status = ? WHERE id = ?',
          [status, taskId],
    function (err,rows) {
      if (err) {throw err;}
      console.log('values updated');
      res.redirect(302, '../todo');
    }
  );
});

app.post('/update-description', requireAuth, (req, res) => {
  const taskId = req.body.id;
  const description = req.body.description;

  db.run(
          'UPDATE todo SET Description = ? WHERE id = ?',
          [description, taskId],
    function (err,rows) {
      if (err) {throw err;}
      console.log('values updated');
      res.redirect(302, '../todo');
    }
  );
});

app.get('/comments', requireAuth, function (req, res) {
  const taskId = req.query.taskId;

  var sql = `SELECT * FROM comments WHERE taskId = "${taskId}"`

  db.all(sql, function (err, rows) {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

app.post('/add-comment', requireAuth, (req, res) => {
  const taskId = req.body.taskId;
  const content = req.body.content;
  const date = req.body.date;
  console.log(date);

  db.run(
          'INSERT INTO comments(user, taskId, content, date) VALUES (?, ?, ?, ?)',
          [req.session.user, taskId, content, date],
    function (err,rows) {
      if (err) {throw err;}
      console.log('comment added');
      res.redirect(302, '../todo');
    }
  );
});

app.delete('/delete-comment', requireAuth, (req, res) => {
  const id = req.body.id;

  db.run('DELETE FROM comments WHERE id = ?', id, function (err, result) {
    if (err) throw err;
    console.log("Comment deleted");
    res.status(200).send();
  });
});

app.use((req, res, next) => {
  res.status(404).send("Route not found!");
})