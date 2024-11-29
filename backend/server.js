const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'AB12cd34@.',
  database: 'CSE',
});

// JWT Secret Key (Use environment variables in production)
const SECRET_KEY = 'your_secret_key';

// User Sign-Up route
app.post('/signup', (req, res) => {
  const { user_id, name, email, password, phone_number, role } = req.body;

  if (!user_id || !name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Check if user_id already exists
  const checkUserIdQuery = 'SELECT * FROM User WHERE user_id = ?';
  db.query(checkUserIdQuery, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'User ID already exists.' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error during password hashing.' });
      }

      // Insert user into the database
      const query =
        'INSERT INTO User (user_id, name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(
        query,
        [user_id, name, email, hashedPassword, phone_number, role],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: 'Error during sign-up. Please try again.' });
          }
          res.json({ success: true, message: 'User created successfully!' });
        }
      );
    });
  });
});

// User Log-In route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM User WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    bcrypt.compare(password, results[0].password, (err, match) => {
      if (err || !match) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ user_id: results[0].user_id, role: results[0].role }, SECRET_KEY, {
        expiresIn: '1h',
      });

      res.json({
        success: true,
        message: 'Login successful!',
        token: token,
        role: results[0].role
      });
    });
  });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token.' });
    }

    req.user = user; // Attach user info to request
    next();
  });
};

// Reset Password Route
app.post('/reset-password', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM User WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'This email is not registered yet.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const updateQuery = 'UPDATE User SET password = ? WHERE email = ?';
    db.query(updateQuery, [hashedPassword, email], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating password.' });
      }
      res.json({ success: true, message: 'Password has been reset successfully.' });
    });
  });
});

// Delete Account Route
app.delete('/delete-account', authenticateJWT, (req, res) => {
  const userId = req.user.user_id; // Assuming the token contains the user_id
  const query = 'DELETE FROM User WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error during account deletion:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete account.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'Account deleted successfully.' });
  });
});

// Dashboard (Protected Route)
app.get('/dashboard', authenticateJWT, (req, res) => {
  res.json({ success: true, message: `Welcome to the dashboard, user ${req.user.user_id}` });
});

// Get All Clubs
app.get('/clubs/all', (req, res) => {
  const query = 'SELECT * FROM Club';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }
    res.json({ clubs: results });
  });
});

// Get All Events
app.get('/events/all', (req, res) => {
  const query = `
    SELECT Event.*, Club.club_name 
    FROM Event 
    JOIN Club ON Event.club_id = Club.club_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }
    res.json({ events: results });
  });
});

// Get All Resources
app.get('/resources/all', (req, res) => {
  const query = 'SELECT * FROM Resource';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }
    res.json({ resources: results });
  });
});

// Get Event Details
app.get('/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT Event.*, Club.club_name 
    FROM Event 
    JOIN Club ON Event.club_id = Club.club_id
    WHERE Event.event_id = ?
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({ event: results[0] });
  });
});

// Register for an Event
app.post('/register/:eventId', authenticateJWT, (req, res) => {
  const userId = req.user.user_id;  // Get user ID from JWT token
  const eventId = req.params.eventId;  // Get event ID from URL

  try {
    // Check if the user is already registered for the event
    const checkRegistrationQuery = 'SELECT * FROM Registrations WHERE user_id = ? AND event_id = ?';
    db.query(checkRegistrationQuery, [userId, eventId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database query error.' });
      }
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
      }

      // Insert into Registrations table
      const registerQuery = 'INSERT INTO Registrations (user_id, event_id) VALUES (?, ?)';
      db.query(registerQuery, [userId, eventId], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error registering for event.' });
        }
        res.json({ success: true, message: 'Successfully registered for the event!' });
      });
    });
  } catch (error) {
    console.error('Error during event registration:', error);
    res.status(500).json({ success: false, message: 'Unexpected error occurred during registration.' });
  }
});

app.post("/create-club", authenticateJWT, (req, res) => {
  console.log("Create Club Endpoint Hit"); // Debugging log
  console.log("Request User:", req.user); // User details from JWT
  console.log("Request Body:", req.body); // Data sent from frontend

  if (req.user.role !== "Admin") {
    console.log("Access Denied: User Role is not Admin");
    return res.status(403).json({ error: "Access denied" });
  }

  const { club_name, description, creation_date } = req.body;
  const query =
    "INSERT INTO Club (club_name, description, creation_date, user_id) VALUES (?, ?, ?, ?)";
  db.query(query, [club_name, description, creation_date, req.user.user_id], (err) => {
    if (err) {
      console.error("Database Error:", err); // Log database error
      return res.status(500).json({ error: "Failed to create club" });
    }
    console.log("Club Created Successfully"); // Success log
    res.status(201).json({ message: "Club created successfully" });
  });
});


// Create Event
app.post("/create-event", authenticateJWT, (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ error: "Access denied" });

  const { event_name, club_id, event_date, event_description, location } = req.body;
  const query = "INSERT INTO Event (event_name, club_id, event_date, event_description, location) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [event_name, club_id, event_date, event_description, location], (err) => {
    if (err) return res.status(500).json({ error: "Failed to create event" });
    res.status(201).json({ message: "Event created successfully" });
  });
});


// Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
