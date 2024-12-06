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
const fs = require('fs');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
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

      // Generate JWT token with additional details if needed
      const token = jwt.sign(
        { user_id: results[0].user_id, role: results[0].role, userName: results[0].name, userEmail: results[0].email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Send the response with additional user details
      res.json({
        success: true,
        message: 'Login successful!',
        token: token,
        user_id: results[0].user_id,
        userName: results[0].name,
        userEmail: results[0].email, // Ensure email is included
        userPhone: results[0].phone, // Include phone if needed
        role: results[0].role
        // Add other details as necessary (clubs, events, etc.)
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
  const { user_id, name, email, role } = req.user;

  // Optionally fetch additional data like clubs, events, etc.
  res.json({
    success: true,
    message: `Welcome to the dashboard, ${name}`,
    userDetails: {
      userId: user_id,
      userName: name,
      userEmail: email,
      userRole: role,
    }
  });
});


// Get All Clubs
app.get('/clubs/all', (req, res) => {
  const query = 'SELECT club_id, club_name, description, profile_photo FROM Club'; // Ensure profile_photo is selected
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
        cb(null, './uploads'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const username = req.body.username; // Ensure 'username' is passed in the request body
        const uniqueName = `${username}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Routes

// Upload a New Resource
app.post('/resources/upload', upload.single('file'), (req, res) => {
    const { user_id, title, description, username } = req.body;

    if (!req.file || !title || !user_id) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname);

    const query = `
        INSERT INTO Resource (user_id, title, type, file_path, description)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [user_id, title, fileType, filePath, description || ''];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ message: 'Failed to upload resource.' });
        }

        res.status(200).json({
            success: true,
            resource: {
                resource_id: results.insertId,
                user_id,
                title,
                type: fileType,
                file_path: filePath,
                description,
                upload_date: new Date()
            }
        });
    });
});

// Get All Resources
app.get('/resources/all', (req, res) => {
    const query = `SELECT * FROM Resource ORDER BY upload_date DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database fetch error:', err);
            return res.status(500).json({ message: 'Failed to fetch resources.' });
        }

        // Construct full URLs for files
        const resources = results.map((resource) => ({
            ...resource,
            file_url: `http://localhost:8000/${resource.file_path.replace(/\\/g, '/')}` // Replace backslashes with forward slashes for Windows compatibility
        }));

        res.status(200).json({ success: true, resources });
    });
});


// Get Event Details
// Get event details
app.get('/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT 
      Event.event_id, 
      Event.event_name, 
      Event.event_date, 
      Event.event_description, 
      Event.location, 
      Event.cover_photo,
      Club.club_name
    FROM 
      Event 
    JOIN 
      Club 
    ON 
      Event.club_id = Club.club_id
    WHERE 
      Event.event_id = ?
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = {
      ...results[0],
      event_date: results[0].event_date ? new Date(results[0].event_date).toISOString().split('T')[0] : null,
    };

    res.json({ success: true, event });
  });
});

// Check if user is already registered for an event
app.get('/check-registration/:eventId', authenticateJWT, (req, res) => {
  const userId = req.user.user_id;  // Get user ID from JWT token
  const eventId = req.params.eventId;  // Get event ID from URL

  const checkRegistrationQuery = 'SELECT * FROM Registrations WHERE user_id = ? AND event_id = ?';
  
  db.query(checkRegistrationQuery, [userId, eventId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Database query error.' });
    }

    if (results.length > 0) {
      return res.status(200).json({ success: true }); // User already registered
    } else {
      return res.status(404).json({ success: false, message: 'Not registered yet.' }); // Not registered
    }
  });
});

// Register user for an event
app.post('/register/:eventId', authenticateJWT, (req, res) => {
  const userId = req.user.user_id;  // Get user ID from JWT token
  const eventId = req.params.eventId;  // Get event ID from URL

  // Insert into Registrations table
  const registerQuery = 'INSERT INTO Registrations (user_id, event_id) VALUES (?, ?)';
  
  db.query(registerQuery, [userId, eventId], (err, result) => {
    if (err) {
      console.error('Error registering for event:', err); // Log the actual error
      return res.status(500).json({ success: false, message: 'Error registering for event.' });
    }
    res.json({ success: true, message: 'Successfully registered for the event!' });
  });
});
//club

app.post("/create-club", authenticateJWT, upload.fields([
  { name: "profile_photo", maxCount: 1 },
  { name: "additional_photo", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), (req, res) => {
  console.log("Create Club Endpoint Hit");
  console.log("Request User:", req.user); // User details from JWT
  console.log("Request Body:", req.body); // Data sent from frontend

  // Check if the user has Admin role
  if (req.user.role !== "Admin") {
    console.log("Access Denied: User Role is not Admin");
    return res.status(403).json({ error: "Access denied" });
  }

  const { club_name, description, creation_date } = req.body;

  // Prepare file paths
  let profile_photo = req.files["profile_photo"] ? req.files["profile_photo"][0].path : null;
  let additional_photo = req.files["additional_photo"] ? req.files["additional_photo"][0].path : null;
  let video = req.files["video"] ? req.files["video"][0].path : null;

  // Insert the club data into the database
  const query =
    "INSERT INTO Club (club_name, description, creation_date, user_id, profile_photo, additional_photo, video) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
  db.query(query, [club_name, description, creation_date, req.user.user_id, profile_photo, additional_photo, video], (err) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to create club" });
    }

    console.log("Club Created Successfully");
    res.status(201).json({ message: "Club created successfully" });
  });
});

//admn

// Create Event
app.post("/create-event", authenticateJWT, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied. Only Admins can create events." });
  }

  const { event_name, club_id, event_date, event_description, location } = req.body;

  if (!event_name || !club_id || !event_date || !event_description || !location) {
    return res.status(400).json({ error: "All fields are required to create an event." });
  }

  // Check if club_id exists
  const clubCheckQuery = "SELECT * FROM Club WHERE club_id = ?";
  db.query(clubCheckQuery, [club_id], (clubErr, clubResults) => {
    if (clubErr) {
      console.error("Database Error (Club Check):", clubErr);
      return res.status(500).json({ error: "Internal server error while verifying club ID." });
    }
    if (clubResults.length === 0) {
      return res.status(400).json({ error: "Invalid club ID." });
    }

    // Proceed to create the event
    const query = `
      INSERT INTO Event (event_name, club_id, event_date, event_description, location)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [event_name, club_id, event_date, event_description, location], (err) => {
      if (err) {
        console.error("Database Error (Insert Event):", err);
        return res.status(500).json({ error: "Failed to create event. Please try again later." });
      }

      res.status(201).json({ message: "Event created successfully." });
    });
  });
});


//club de
app.get('/clubs/:clubId', (req, res) => {
  const { clubId } = req.params;

  // Query to get all club details including media
  const query = `
    SELECT 
      club_id, 
      club_name, 
      description, 
      creation_date, 
      profile_photo, 
      additional_photo, 
      video 
    FROM Club
    WHERE club_id = ?
  `;

  // Fetch club details by clubId
  db.query(query, [clubId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Error fetching club details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const club = results[0];

    // Query to count the total number of members in the 'Members' table
    const membersQuery = 'SELECT COUNT(*) AS total_members FROM Members WHERE club_id = ?';
    db.query(membersQuery, [clubId], (err, memberResults) => {
      if (err) {
        console.error('Error fetching member count:', err);
        return res.status(500).json({ success: false, message: 'Error fetching member count' });
      }

      // Add the total member count to the club object
      club.total_members = memberResults[0].total_members;

      // Respond with the full club details
      res.json({ club });
    });
  });
});

// Join a club (POST request)
app.post('/club/join', authenticateJWT, (req, res) => {
  const { club_id } = req.body;
  const user_id = req.user.user_id;  // Retrieve user_id from the JWT payload (req.user)

  if (!club_id) {
    return res.status(400).json({ success: false, message: 'Club ID is required.' });
  }

  // Check if the user is already a member of the club
  const checkQuery = 'SELECT * FROM Members WHERE user_id = ? AND club_id = ?';
  db.query(checkQuery, [user_id, club_id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Database error:', checkErr); // Log error for debugging
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
        console.error('Error inserting into Members table:', insertErr); // Log error for debugging
        return res.status(500).json({ success: false, message: 'Error joining club' });
      }

      res.json({ success: true, message: 'Joined the club successfully' });
    });
  });
});


// Endpoint to share a new thought with an optional photo/video

app.post("/share-thought", authenticateJWT, upload.fields([{ name: "photo", maxCount: 1 }, { name: "video", maxCount: 1 }]), (req, res) => {
  const { thought } = req.body;
  const user_id = req.user.user_id;
  const photo = req.files["photo"] ? req.files["photo"][0].path : null;
  const video = req.files["video"] ? req.files["video"][0].path : null;

  if (!thought) {
    return res.status(400).json({ error: "Thought is required" });
  }

  const query = `INSERT INTO thoughts (user_id, thought, photo, video) VALUES (?, ?, ?, ?)`;
  db.query(query, [user_id, thought, photo, video], (err, result) => {
    if (err) {
      console.error("Error inserting thought:", err);
      return res.status(500).json({ error: "Failed to share your thought." });
    }
    res.status(200).json({ message: "Thought shared successfully!" });
  });
});

// Route to fetch all thoughts
// Route to fetch all thoughts along with user name
app.get("/thoughts", (req, res) => {
  const query = `
    SELECT thoughts.id, thoughts.thought, thoughts.photo, thoughts.video, user.name 
    FROM thoughts 
    INNER JOIN user ON thoughts.user_id = user.user_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching thoughts:", err);
      return res.status(500).json({ error: "Failed to load thoughts." });
    }
    res.status(200).json({ thoughts: results });
  });
});


//
app.get("/users", authenticateJWT, (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users." });
    }
    res.status(200).json({ users: results });
  });
});


// Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
