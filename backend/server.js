const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path'); 
const sanitizeFilename = (filename) => path.basename(filename);



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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
   const token = req.header('Authorization')?.split(' ')[1]; /// Expect "Bearer <token>"

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
      return res.status(500).json({ success: false, message: 'Error fetching clubs' });
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
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique file name
  },
});

const upload = multer({ storage });

// API Endpoints

// 1. Fetch All Resources
app.get('/resources/all', (req, res) => {
  const query = `
    SELECT 
      resource_id, 
      user_id, 
      title, 
      type, 
      upload_date, 
      file_path, 
      description 
    FROM Resource
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }

    res.status(200).json({
      success: true,
      resources: results.map((resource) => ({
        ...resource,
        file_url: `http://localhost:${PORT}/uploads/${path.basename(resource.file_path)}`,
      })),
    });
  });
});

// 2. Upload a New Resource
app.post('/resources/upload', upload.single('file'), (req, res) => {
  const { title, description, user_id } = req.body;

  if (!req.file || !title || !user_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields or file.' });
  }

  const filePath = `uploads/${req.file.filename}`;
  const fileType = req.file.mimetype;

  const query = `
    INSERT INTO Resource (user_id, title, type, file_path, description, upload_date)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const values = [user_id, title, fileType, filePath, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database insertion error:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to save the resource.' });
    }

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully.',
      resource: {
        resource_id: result.insertId,
        user_id,
        title,
        type: fileType,
        file_url: `http://localhost:${PORT}/${filePath}`,
        description,
        upload_date: new Date().toISOString(),
      },
    });
  });
});

// 3. Download a Resource (Optional
// Download a Resource
// Download a Resource
app.get('/resources/download/:filename', (req, res) => {
  const { filename } = req.params;

  // Query the database to fetch the file path from the 'Resource' table
  const query = 'SELECT file_path FROM Resource WHERE file_path LIKE ?';
  db.query(query, [`%${filename}`], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Error fetching file details from the database.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found in the database.' });
    }

    // Get the relative file path from the database
    const filePath = path.join(__dirname, results[0].file_path);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on the server.' });
    }

    // Serve the file for download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading the file:', err.message);
        return res.status(500).json({ success: false, message: 'Error while downloading the file.' });
      }
    });
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


//club de
app.get('/clubs/:clubId', (req, res) => {
  const clubId = req.params.clubId;
  const query = 'SELECT * FROM Club WHERE club_id = ?';
  
  db.query(query, [clubId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching club details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    const club = results[0];
    
    // Get the total number of members
    const membersQuery = 'SELECT COUNT(*) AS total_members FROM Members WHERE club_id = ?';
    db.query(membersQuery, [clubId], (err, memberResults) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error fetching member count' });
      }
      club.total_members = memberResults[0].total_members;
      res.json({ club });
    });
  });
});

// Join a club (POST request)
app.post('/club/join', (req, res) => {
  const { club_id } = req.body;
  const user_id = 1; // Example user_id, should come from authenticated session

  // Check if the user is already a member of the club
  const checkQuery = 'SELECT * FROM Members WHERE user_id = ? AND club_id = ?';
  db.query(checkQuery, [user_id, club_id], (checkErr, checkResults) => {
    if (checkErr) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (checkResults.length > 0) {
      // User is already a member of the club
      return res.status(400).json({ success: false, message: 'You have already joined this club' });
    }

    // If not a member, insert into the Members table
    const insertQuery = 'INSERT INTO Members (user_id, club_id) VALUES (?, ?)';
    db.query(insertQuery, [user_id, club_id], (insertErr, insertResults) => {
      if (insertErr) {
        return res.status(500).json({ success: false, message: 'Error joining club' });
      }

      res.json({ success: true, message: 'Joined the club successfully' });
    });
  });
});




// Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
