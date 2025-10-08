const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { stringify } = require('csv-stringify');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const app = express();
const port = 5000;

app.set("trust proxy", 1);
// Middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));




app.use(bodyParser.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Use the environment variable
  // origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});
app.use((req, res, next) => {
  //console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


// MySQL connection pooling
const db = mysql.createPool({
  connectionLimit: 10,
  host: "147.93.79.55", // Use this instead of "localhost"
  user: "u679703987_clone",
  password: "U679703987_clone", // The same password
  database: "u679703987_clone",
  connectTimeout: 30000, // Increase timeout to 30 seconds
  timezone: 'local'
});


const handleDisconnect = () => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Attempt to reconnect after 2 seconds
    } else {
      //console.log('Connected to MySQL database...');
      connection.release();
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect on connection loss
    } else {
      throw err;
    }
  });
};

handleDisconnect();

// Function to ensure all required tables exist
function ensureAllTablesExist() {
  // Create refund_requests table
  const createRefundTableQuery = `
    CREATE TABLE IF NOT EXISTS refund_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      card_number VARCHAR(255) NOT NULL,
      card_holder VARCHAR(255),
      price DECIMAL(10,2) DEFAULT 0.00,
      status ENUM('PENDING', 'REFUNDED', 'REJECTED') DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      processed_at TIMESTAMP NULL,
      INDEX idx_order_username (order_id, username),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Create two_d_cards table
  const createTwoDCardsTableQuery = `
    CREATE TABLE IF NOT EXISTS two_d_cards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bin VARCHAR(255),
      card_type VARCHAR(255),
      cardHolder VARCHAR(255),
      expiry VARCHAR(255),
      price DECIMAL(10,2) DEFAULT 0.00,
      cvv VARCHAR(255),
      country VARCHAR(255),
      state VARCHAR(255),
      city VARCHAR(255),
      zip VARCHAR(255),
      level VARCHAR(255),
      bankname VARCHAR(255),
      base VARCHAR(255),
      balance DECIMAL(10,2) DEFAULT 0.00,
      user VARCHAR(255) NULL,
      INDEX idx_user (user),
      INDEX idx_bin_type (bin, card_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Create two_d_cart table
  const createTwoDCartTableQuery = `
    CREATE TABLE IF NOT EXISTS two_d_cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bin VARCHAR(255),
      card_type VARCHAR(255),
      cardHolder VARCHAR(255),
      expiry VARCHAR(255),
      price DECIMAL(10,2) DEFAULT 0.00,
      cvv VARCHAR(255),
      country VARCHAR(255),
      state VARCHAR(255),
      city VARCHAR(255),
      zip VARCHAR(255),
      level VARCHAR(255),
      bankname VARCHAR(255),
      base VARCHAR(255),
      user VARCHAR(255),
      INDEX idx_user (user),
      INDEX idx_bin_holder (bin, cardHolder)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Create cart table for credit cards
  const createCartTableQuery = `
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ccnum VARCHAR(255),
      yymm VARCHAR(255),
      cvv VARCHAR(255),
      holder VARCHAR(255),
      addr VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(255),
      zip VARCHAR(255),
      phone VARCHAR(255),
      country VARCHAR(255),
      bank VARCHAR(255),
      level VARCHAR(255),
      type VARCHAR(255),
      base VARCHAR(255),
      price DECIMAL(10,2) DEFAULT 0.00,
      user VARCHAR(255),
      INDEX idx_user (user),
      INDEX idx_bin_cvv (ccnum, cvv)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Create buyed table
  const createBuyedTableQuery = `
    CREATE TABLE IF NOT EXISTS buyed (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(255),
      ccnum VARCHAR(255),
      yymm VARCHAR(255),
      cvv VARCHAR(255),
      holder VARCHAR(255),
      addr VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(255),
      zip VARCHAR(255),
      phone VARCHAR(255),
      country VARCHAR(255),
      bank VARCHAR(255),
      level VARCHAR(255),
      type VARCHAR(255),
      base VARCHAR(255),
      price DECIMAL(10,2) DEFAULT 0.00,
      user VARCHAR(255),
      bins INT DEFAULT 0,
      INDEX idx_code (code),
      INDEX idx_user (user)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Create orders table
  const createOrdersTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(255),
      quantity INT DEFAULT 1,
      total_price DECIMAL(10,2) DEFAULT 0.00,
      user VARCHAR(255),
      type VARCHAR(255),
      cc_num VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_code (code),
      INDEX idx_user (user),
      INDEX idx_type (type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Create payment table
  const createPaymentTableQuery = `
    CREATE TABLE IF NOT EXISTS payment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255),
      amount DECIMAL(10,2) DEFAULT 0.00,
      status VARCHAR(255) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_username (username),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Execute all table creation queries
  const queries = [
    { name: 'refund_requests', query: createRefundTableQuery },
    { name: 'two_d_cards', query: createTwoDCardsTableQuery },
    { name: 'two_d_cart', query: createTwoDCartTableQuery },
    { name: 'cart', query: createCartTableQuery },
    { name: 'buyed', query: createBuyedTableQuery },
    { name: 'orders', query: createOrdersTableQuery },
    { name: 'payment', query: createPaymentTableQuery }
  ];

  queries.forEach(({ name, query }) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(`Error creating ${name} table:`, err);
      } else {
        console.log(`${name} table ensured to exist`);
      }
    });
  });
}

// Call the function when server starts
ensureAllTablesExist();
ensureRefundColumnExists((err) => {
  if (err) {
    console.error('Error ensuring refund column exists:', err);
  }
});

app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) {
            console.error('Database Test Error:', err);
            return res.status(500).send({ message: 'Database Connection Failed' });
        }
        res.send({ message: 'Database Connected', result: results[0].result });
    });
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vclubunitedshop@gmail.com',
    pass: 'inpk vbyr nvae bjww' // Your app password
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter config error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


const sendMdsCodeEmail = (email, mdsCode) => {
  const mailOptions = {
    from: 'vclubunitedshop@gmail.com',
    to: email,
    subject: 'Your MDS Code',
    text: `Thank you for registering. Your MDS code is: ${mdsCode} kindly save it for future login`
  };

  return transporter.sendMail(mailOptions);
};
function generateTransactionId() {
  return crypto.randomBytes(6).toString('base64').replace(/[+/=]/g, '').substring(0, 8);
}
// owners email
// Add this route to server.js

app.post('/api/preorder', (req, res) => {
  const { username, bin, amount, bidbin } = req.body;

  const mailOptions = {
    from: 'vclubunitedshop@gmail.com',
    to: 'vclubunitedshop@gmail.com',
    subject: 'New Preorder Request',
    text: `Preorder request from ${username}:
    bin : ${bin},
    amount : ${amount},
    bidbin : ${bidbin}`
  };

  db.query(
    "INSERT INTO preorder(user,bin,amount,bidbin) VALUES (?,?,?,?)",
    [username, bin, amount, bidbin],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send({ message: 'Failed to send preorder request' });
        }

        // Only send the response once, after both DB insert and email succeed
        return res.status(200).send({ message: 'Preorder request sent successfully' });
      });
    }
  );
});

app.get("/api/preorder/:username",(req,res)=>{
  const {username} = req.params;
  db.query("select * from preorder where user = ?",[username],(err,result)=>{
    if(err){
      console.log(err);
      return res.status(401).json({error : err})
    }
    return res.status(200).json({data : result})
  })
})
app.post('/api/signup', (req, res) => {
  const { username, password, email } = req.body;

  // Check if the username or email already exists
  const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkSql, [username, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).send({ message: 'Username or email already in use' });
    }

      const insertSql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
      db.query(insertSql, [username, password, email], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send({ message: 'Database error' });
        }
        res.status(200).send({ message: 'Signup successful', role: 'user' });
      });
    });
  });


// Login route
app.post('/api/login', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }

      if (results.length > 0) {
        const user = results[0];
        
        // Check if 2FA is enabled
        if (user.twoFactorEnabled && user.verify) {
          // 2FA is enabled, redirect to 2FA verification
          req.session.username = username;
          req.session.pending2FA = true;
          res.status(200).send({
            message: 'Login successful, 2FA required',
            redirectTo: '/login/2fa',
            username: user.username,
            role: user.role,
            requires2FA: true
          });
        } else {
          // No 2FA required, proceed with normal login
          req.session.username = username;
          req.session.verified = true;
          res.status(200).send({
            message: 'Login successful',
            redirectTo: '/billing',
            username: user.username,
            role: user.role,
            requires2FA: false
          });
        }
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    });
  });
});

// Two-Factor Authentication Endpoints

// Check 2FA status
app.post('/api/check-2fa-status', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username } = req.body;
    
    const sql = 'SELECT twoFactorEnabled, verify FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      if (results.length > 0) {
        res.status(200).send({
          isSetup: results[0].twoFactorEnabled === 1,
          verify: results[0].verify === 1
        });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    });
  });
});

// Generate 2FA secret
app.post('/api/generate-2fa-secret', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username } = req.body;
    
    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `VClub (${username})`,
      issuer: 'VClub',
      length: 32
    });

    // Generate QR code
    QRCode.toDataURL(secret.otpauth_url, (err, qrCode) => {
      if (err) {
        console.error('QR Code generation error:', err);
        return res.status(500).send({ message: 'QR Code generation failed' });
      }

      res.status(200).send({
        success: true,
        secret: secret.base32,
        qrCode: qrCode
      });
    });
  });
});

// Verify and setup 2FA
app.post('/api/verify-2fa-setup', (req, res) => {
  
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username, secret, verificationCode } = req.body;

    if (!username || !secret || !verificationCode) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: verificationCode,
      window: 2 // Allow 2 time steps in case of slight time differences
    });

    if (verified) {
      // Update user with 2FA secret and enable it
      const updateSql = 'UPDATE users SET twoFactorSecret = ?, twoFactorEnabled = TRUE, verify = TRUE WHERE username = ?';
      db.query(updateSql, [secret, username], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send({ message: 'Database error' });
        }

        // Set session as verified after successful 2FA setup
        req.session.username = username;
        req.session.verified = true;

        res.status(200).send({
          success: true,
          message: 'Two-factor authentication setup successful'
        });
      });
    } else {
      res.status(400).send({
        success: false,
        message: 'Invalid verification code'
      });
    }
  });
});

// Verify 2FA for login
app.post('/api/verify-2fa-login', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username, verificationCode } = req.body;

    if (!username || !verificationCode) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Get user's 2FA secret
    const sql = 'SELECT twoFactorSecret, verify FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }

      const user = results[0];
      
      if (!user.twoFactorSecret) {
        return res.status(400).send({ message: '2FA not set up for this user' });
      }

      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: verificationCode,
        window: 2
      });

      if (verified) {
        // Set session and mark as verified
        req.session.username = username;
        req.session.verified = true;
        
        res.status(200).send({
          success: true,
          message: 'Verification successful'
        });
      } else {
        res.status(400).send({
          success: false,
          message: 'Invalid verification code'
        });
      }
    });
  });
});

// Disable 2FA
app.post('/api/disable-2fa', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username, verificationCode } = req.body;

    if (!username || !verificationCode) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Get user's 2FA secret
    const sql = 'SELECT twoFactorSecret FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }

      const user = results[0];
      
      if (!user.twoFactorSecret) {
        return res.status(400).send({ message: '2FA not set up for this user' });
      }

      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: verificationCode,
        window: 2
      });

      if (verified) {
        // Disable 2FA
        const updateSql = 'UPDATE users SET twoFactorSecret = NULL, twoFactorEnabled = FALSE, verify = FALSE WHERE username = ?';
        db.query(updateSql, [username], (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ message: 'Database error' });
          }

          res.status(200).send({
            success: true,
            message: 'Two-factor authentication disabled successfully'
          });
        });
      } else {
        res.status(400).send({
          success: false,
          message: 'Invalid verification code'
        });
      }
    });
  });
});

// Simple disable 2FA (no verification required)
app.post('/api/disable-2fa-simple', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username } = req.body;

    if (!username) {
      return res.status(400).send({ message: 'Missing username' });
    }

    // Simply disable 2FA by setting all fields to null/false
    const updateSql = 'UPDATE users SET twoFactorSecret = NULL, twoFactorEnabled = FALSE, verify = FALSE WHERE username = ?';
    db.query(updateSql, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      res.status(200).send({
        success: true,
        message: 'Two-factor authentication disabled successfully'
      });
    });
  });
});

// Helper to check and add columns if missing
function ensureResetColumnsExist(callback) {
  const checkSql = "SHOW COLUMNS FROM users LIKE 'resetPasswordToken'";
  db.query(checkSql, (err, results) => {
    if (err) {
      console.error('Error checking for resetPasswordToken column:', err);
      return callback(err);
    }
    if (results.length === 0) {
      // Column does not exist, so add both columns
      console.log('resetPasswordToken column missing, adding columns...');
      const alterSql = `
        ALTER TABLE users
        ADD COLUMN resetPasswordToken VARCHAR(255) NULL,
        ADD COLUMN resetPasswordExpires DATETIME NULL
      `;
      db.query(alterSql, (alterErr) => {
        if (alterErr) {
          console.error('Error adding columns:', alterErr);
          return callback(alterErr);
        }
        console.log('Columns added successfully.');
        callback(null);
      });
    } else {
      console.log('resetPasswordToken column exists.');
      callback(null);
    }
  });
}

// Helper to check and add 2FA columns if missing
function ensureTwoFactorColumnsExist(callback) {
  const checkSql = "SHOW COLUMNS FROM users LIKE 'twoFactorSecret'";
  db.query(checkSql, (err, results) => {
    if (err) {
      console.error('Error checking for twoFactorSecret column:', err);
      return callback(err);
    }
    if (results.length === 0) {
      // Column does not exist, so add 2FA columns
      console.log('twoFactorSecret column missing, adding 2FA columns...');
      const alterSql = `
        ALTER TABLE users
        ADD COLUMN twoFactorSecret VARCHAR(255) NULL,
        ADD COLUMN twoFactorEnabled BOOLEAN DEFAULT FALSE,
        ADD COLUMN verify BOOLEAN DEFAULT FALSE
      `;
      db.query(alterSql, (alterErr) => {
        if (alterErr) {
          console.error('Error adding 2FA columns:', alterErr);
          return callback(alterErr);
        }
        console.log('2FA columns added successfully.');
        callback(null);
      });
    } else {
      console.log('twoFactorSecret column exists.');
      callback(null);
    }
  });
}

// Helper to check and add refund column if missing
function ensureRefundColumnExists(callback) {
  const checkSql = "SHOW COLUMNS FROM users LIKE 'refund'";
  db.query(checkSql, (err, results) => {
    if (err) {
      console.error('Error checking for refund column:', err);
      return callback(err);
    }
    if (results.length === 0) {
      // Column does not exist, so add refund column
      console.log('refund column missing, adding refund column...');
      const alterSql = `
        ALTER TABLE users
        ADD COLUMN refund INT DEFAULT 100
      `;
      db.query(alterSql, (alterErr) => {
        if (alterErr) {
          console.error('Error adding refund column:', alterErr);
          return callback(alterErr);
        }
        console.log('refund column added successfully.');
        callback(null);
      });
    } else {
      console.log('refund column exists.');
      callback(null);
    }
  });
}

// Forgot Password Request
app.post('/api/forgot-password', (req, res) => {
  ensureResetColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { email, userCaptchaInput, captchaAnswer } = req.body;

    // Captcha check (case-insensitive)
    if (!userCaptchaInput || !captchaAnswer || userCaptchaInput.trim().toLowerCase() !== captchaAnswer.trim().toLowerCase()) {
      return res.status(400).send({ message: 'Invalid captcha' });
    }

    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    // Check if user exists with this email
    const checkSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkSql, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).send({ message: 'No account found with this email address' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Update user with reset token
      const updateSql = 'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?';
      db.query(updateSql, [resetToken, resetTokenExpiry, email], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Database error:', updateErr);
          return res.status(500).send({ message: 'Database error' });
        }

        // Send reset email
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
        const mailOptions = {
          from: 'vclubunitedshop@gmail.com',
          to: email,
          subject: 'Password Reset Request',
          html: `
            <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
              <h2 style=\"color: #333;\">Password Reset Request</h2>
              <p>You requested a password reset for your account.</p>
              <p>Click the link below to reset your password:</p>
              <a href=\"${resetUrl}\" style=\"display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;\">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>VClub Team</p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (emailErr, info) => {
          if (emailErr) {
            console.error('Email error:', emailErr);
            return res.status(500).send({ message: 'Failed to send reset email' });
          }
          res.status(200).send({ message: 'Password reset email sent successfully' });
        });
      });
    });
  });
});

// Reset Password
app.post('/api/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send({ message: 'Token and new password are required' });
  }

  // Find user with valid reset token
  const checkSql = 'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()';
  db.query(checkSql, [token], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).send({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    const updateSql = 'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken = ?';
    db.query(updateSql, [newPassword, token], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Database error:', updateErr);
        return res.status(500).send({ message: 'Database error' });
      }

      res.status(200).send({ message: 'Password reset successfully' });
    });
  });
});

// Data route for fetching graph data
app.get('/api/data', (req, res) => {
  const sql = 'SELECT cvv, ssn, checker, floods FROM transaction';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    const graphData = results.map(row => ({
      cvv: row.cvv,
      ssn: row.ssn,
      checker: row.checker,
      floods: row.floods
    }));

    res.status(200).send(graphData);
  });
});
app.get('/api/balance', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }


  db.query('SELECT balance FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send({ message: 'Failed to fetch balance' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ balance: results[0].balance });
  });
});
app.get('/api/checks', (req, res) => {
  ensureTwoFactorColumnsExist((colErr) => {
    if (colErr) {
      return res.status(500).send({ message: 'Database error (column check)' });
    }

    const { username } = req.query;

    if (!username) {
      return res.status(401).send({ message: 'User not authorized' });
    }

    const query = 'SELECT access, twoFactorEnabled, verify FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send({ message: 'Failed to fetch access' });
      }

      if (results.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }

      const user = results[0];
      const access = user.access;
      
      // Check if 2FA is enabled and user needs verification
      if (user.twoFactorEnabled && user.verify && !req.session.verified) {
        return res.status(401).send({ 
          message: '2FA verification required',
          requires2FA: true 
        });
      }
      
      res.send({ access });
    });
  });
});

app.post('/api/admin/users/update', (req, res) => {
  const { username, balance, role, access, refund } = req.body;  // Destructure from req.body
  //console.log(req.body, "data");

  // Correct SQL syntax for update query
  const query = `UPDATE users SET balance = ?, role = ?, access = ?, refund = ? WHERE username = ?`;
  
  db.query(query, [balance, role, access, refund || 0, username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Failed to update user' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ message: 'User updated successfully' });
  });
});
app.post('/api/submit-transaction', (req, res) => {
  const { transactionId, username } = req.body;

  if (!transactionId || !username) {
    return res.status(400).json({ message: 'Missing transaction ID or username' });
  }

  // Insert into payment table
  const insertQuery = 'INSERT INTO payment (address, username) VALUES (?, ?)';
  db.query(insertQuery, [transactionId, username], (insertErr, insertResult) => {
    if (insertErr) {
      console.error('Database insert error:', insertErr);
      return res.status(500).json({ message: 'Failed to record transaction', error: insertErr.toString() });
    }

    // Email setup
    const mailOptions = {
      from: 'vclubunitedshop@gmail.com',
      to: 'vclubunitedshop@gmail.com',
      subject: 'Transaction Details',
      text: `Transaction ID: ${transactionId}\nUsername: ${username}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email', error: error.toString() });
      }
      res.status(200).json({ message: 'Transaction recorded and email sent successfully' });
    });
  });
});


app.post('/api/submit-seller', (req, res) => {
  const { transactionId, username } = req.body; // Access the username from session

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  const mailOptions = {
    from: 'vclubunitedshop@gmail.com',
    to: 'vclubunitedshop@gmail.com',
    subject: 'Sellers Details',


  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    res.status(200).send({ message: 'Email sent successfully' });
  });
});
app.get('/api/graph-data', (req, res) => {
  const query = 'SELECT day, activity FROM user_activity';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      //console.log("home session", req.session);

    }
  });
});

app.get('/api/cities', (req, res) => {
  const query = 'SELECT DISTINCT city FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      //console.log("credit session", req.session);
    }
  });
});
app.get('/api/banks', (req, res) => {
  const query = 'SELECT DISTINCT bank FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/country', (req, res) => {
  const query = 'SELECT DISTINCT country FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/level', (req, res) => {
  const query = 'SELECT DISTINCT level FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/brand', (req, res) => {
  const query = 'SELECT DISTINCT brand FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/state', (req, res) => {
  const query = 'SELECT DISTINCT state FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/base', (req, res) => {
  const query = 'SELECT DISTINCT base FROM credit_card';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/details', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  const query = 'SELECT * FROM transaction where user = ?';
  db.query(query,[username], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/getusers', (req, res) => {
  const query = 'SELECT DISTINCT username FROM users';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      //console.log(results);

    }
  });
});

app.post('/api/cards', (req, res) => {
  const { startPage, endPage, city, state, level, country, bin, bases, bankName, zip, minprice, maxprice, types, hcvv, wcc, waddr, wemail, wphone, wdob, fullz } = req.body;

  // Default to first page if not provided
  const startPageNum = startPage || 1;
  const endPageNum = endPage || 5;

  // Calculate offset and limit for pagination
  const itemsPerPage = 50;
  const offset = (startPageNum - 1) * itemsPerPage;
  const limit = (endPageNum - startPageNum + 1) * itemsPerPage;

  // Start building the query with optimized approach
  let query = 'SELECT * FROM credit_card WHERE user IS NULL';
  const queryParams = [];

  if (bin) {
    query += ' AND bin = ?';
    queryParams.push(bin);
  }
  if (state) {
    query += ' AND state = ?';
    queryParams.push(state);
  }
  if (types) {
    query += ' AND type = ?';
    queryParams.push(types);
  }
  if (city) {
    query += ' AND city = ?';
    queryParams.push(city);
  }
  if (zip) {
    query += ' AND zip = ?';
    queryParams.push(zip);
  }
  if (bases) {
    query += ' AND base = ?';
    queryParams.push(bases);
  }
  if (bankName) {
    query += ' AND bank = ?';
    queryParams.push(bankName);
  }
  if (level) {
    query += ' AND level = ?';
    queryParams.push(level);
  }
  if (country) {
    query += ' AND country = ?';
    queryParams.push(country);
  }
  if (minprice || maxprice) {
    query += ' AND price BETWEEN ? AND ?';
    queryParams.push(minprice || 0);
    queryParams.push(maxprice || 100);
  }
  if (hcvv) {
    query += ' AND cvv IS NOT NULL';
  }
  if (wcc) {
    query += ' AND cvv IS NULL';
  }
  if (waddr) {
    query += ' AND addr IS NOT NULL';
  }
  if (wemail) {
    query += ' AND email IS NOT NULL';
  }
  if (wphone) {
    query += ' AND phone IS NOT NULL';
  }
  if (wdob) {
    query += ' AND dob IS NOT NULL';
  }
  if (fullz) {
    query += ' AND bin IS NOT NULL AND cvv IS NOT NULL AND yymm IS NOT NULL AND country IS NOT NULL AND bank IS NOT NULL AND level IS NOT NULL AND type IS NOT NULL AND holder IS NOT NULL AND city IS NOT NULL AND state IS NOT NULL AND zip IS NOT NULL AND base IS NOT NULL AND price IS NOT NULL AND addr IS NOT NULL AND email IS NOT NULL AND phone IS NOT NULL AND dob IS NOT NULL AND mmn IS NOT NULL AND sortCode IS NOT NULL AND ip IS NOT NULL AND checker IS NOT NULL';
  }

  query += ' ORDER BY id ASC LIMIT ? OFFSET ?';

  // Add timeout for range query
  const timeout = setTimeout(() => {
    res.status(408).json({ error: 'Query timeout - please try with more specific filters' });
  }, 20000); // 20 second timeout

  // Execute the range query
  db.query(query, [...queryParams, limit, offset], (err, results) => {
    clearTimeout(timeout);
    if (err) {
      console.error('Error executing range query:', err.message);
      return res.status(500).json({ error: err.message });
    }

    // Also get total count for this query (without LIMIT/OFFSET)
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total').replace(' ORDER BY id ASC LIMIT ? OFFSET ?', '');
    db.query(countQuery, queryParams, (countErr, countResults) => {
      if (countErr) {
        console.error('Error executing count query:', countErr.message);
        // Return data even if count fails
        res.json({ data: results, total: results.length });
      } else {
        res.json({ data: results, total: countResults[0].total });
      }
    });
  });
});

// 2D Cards API endpoints

app.get('/api/2d-cards', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const query = `SELECT * FROM two_d_cards WHERE user IS NULL`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});



app.get('/api/2d-card/cart', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  
  // Get cart items directly since they contain the card data
  let query = `SELECT * FROM two_d_cart WHERE user = ?`;
  
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/api/2d-card/order', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  let query = 'SELECT * FROM orders WHERE user = ? AND type = ?';
  db.query(query, [username, "2d card"], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });  
});

// POST endpoint for creating orders from cart
app.post('/api/2d-card/order', (req, res) => {
  const { username, info } = req.body;
  const createdAt = new Date(); // or use moment() if using moment.js

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  if (!info || !Array.isArray(info)) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries - using the same orders table as CCS
        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;
        const getUserRoleQuery = `SELECT role FROM users WHERE username = ?`;
        const insertOrderQuery = `INSERT INTO orders (code, quantity, total_price, user, type, cc_num,created) VALUES (?, 1, ?, ?, ?, ?,?)`;
        const insertTransactionQuery = `INSERT INTO transaction (code, method, memo, fee, amount, pay, befor, after, status, user) VALUES (?, '2D-CARD', ?, 0, ?, ?, ?, ?, 'paid', ?)`;
        const deleteFromCartQuery = `DELETE FROM two_d_cart WHERE user = ? AND id = ?`;
        const updateCardOwnerQuery = `UPDATE two_d_cards SET user = ? WHERE id = ?`;
        const insertBuyedQuery = `
          INSERT INTO buyed (
            bin, cvv, yymm, country, bank, level, type, holder,
            city, state, zip, base, price, addr, email, phone, dob, mmn, sortCode,
            ip, checker, additionalInfo, ccnum, user, code, bins
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
        `;

        // Calculate total price
        let totalPrice = 0;
        const type = '2d card';
        const code = generateTransactionId();
        
        // Calculate total price from cart items
        info.forEach(item => {
          totalPrice += parseFloat(item.price) || 0;
        });

        // Get user role and balance
        const [userData] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance, role FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (!userData) {
          throw new Error('User not found');
        }

        // Apply discount if user role is 'reseller'
        if (userData.role === 'reseller') {
          totalPrice *= 0.5; // Apply 50% discount
        }

        // Check if user has sufficient balance
        if (userData.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }

        // Insert transaction record
        await new Promise((resolve, reject) => {
          connection.query(insertTransactionQuery, [
            code, 
            `2D-CARD || PURCHASE ${info.length}pcs`, 
            totalPrice, 
            totalPrice, 
            userData.balance, 
            userData.balance - totalPrice, 
            username
          ], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Update user balance
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Process each cart item
        for (const item of info) {
          console.log('Processing cart item:', { 
            itemId: item.id, 
            username,
            itemData: item 
          });
          
          // Check if card is already owned in two_d_cards table
          const [existingCard] = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM two_d_cards WHERE bin = ? AND card_type = ? AND user IS NULL', [item.bin, item.card_type], (error, results) => {
              if (error) {
                console.error('Error checking card availability:', error);
                reject(error);
              } else {
                console.log(`Found available card for bin ${item.bin}:`, results[0]);
                resolve(results);
              }
            });
          });

          if (!existingCard) {
            throw new Error(`Card with bin ${item.bin} is not available or already owned`);
          }
          
          // Prepare buyed table values using cart item data
          const buyedValues = [
            item.bin,               // `bin`
            item.cvv,               // `cvv`
            item.expiry,            // `yymm` (expiry date)
            item.country,           // `country`
            item.bankname,          // `bank`
            item.level,             // `level`
            item.card_type,         // `type`
            item.cardHolder,        // `holder`
            item.city,              // `city`
            item.state,             // `state`
            item.zip,               // `zip`
            item.base,              // `base`
            item.price,             // `price`
            item.addr || '',        // `addr`
            item.email || '',       // `email`
            item.phone || '',       // `phone`
            item.dob || '',         // `dob`
            item.mmn || '',         // `mmn`
            item.sortCode || '',    // `sortCode`
            item.ip || '',          // `ip`
            item.checker || '',     // `checker`
            item.additionalInfo || '', // `additionalInfo`
            existingCard.id,        // `ccnum` (using actual card id from two_d_cards)
            username,               // `user`
            code                    // `code`
          ];

          console.log('Buyed values prepared:', buyedValues);

          // Insert into buyed table
          await new Promise((resolve, reject) => {
            connection.query(insertBuyedQuery, buyedValues, (error, results) => {
              if (error) {
                console.error('Error inserting into buyed table:', error);
                reject(error);
              } else {
                console.log(`Inserted into buyed table for card ${existingCard.id}. Insert ID:`, results.insertId);
                resolve();
              }
            });
          });

          // Update card ownership
          await new Promise((resolve, reject) => {
            connection.query(updateCardOwnerQuery, [username, existingCard.id], (error, results) => {
              if (error) {
                console.error('Error updating card ownership:', error);
                reject(error);
              } else {
                console.log(`Updated card ${existingCard.id} ownership to user ${username}. Affected rows:`, results.affectedRows);
                resolve();
              }
            });
          });

          // Insert order record using the same orders table as CCS
          await new Promise((resolve, reject) => {
            connection.query(insertOrderQuery, [code, item.price, username, type, existingCard.id,createdAt], (error, results) => {
              if (error) {
                console.error('Error inserting order record:', error);
                reject(error);
              } else {
                console.log(`Inserted order record for card ${existingCard.id} with code ${code}. Insert ID:`, results.insertId);
                resolve();
              }
            });
          });

          // Remove from cart
          await new Promise((resolve, reject) => {
            connection.query(deleteFromCartQuery, [username, item.id], (error, results) => {
              if (error) {
                console.error('Error removing from cart:', error);
                reject(error);
              } else {
                console.log(`Removed card ${item.id} from cart for user ${username}. Affected rows:`, results.affectedRows);
                resolve();
              }
            });
          });
        }

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return connection.rollback(() => {
              res.status(500).send({ message: 'Transaction commit failed' });
            });
          }

          res.send({ message: '2D Card order successful', transactionId: code });
        });
      } catch (error) {
        console.error('Transaction error:', error);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});

// 2D Card order view endpoint (similar to CCS)
app.get('/api/2d-card/order/view/:code', (req, res) => {
  const { username } = req.query;
  const { code } = req.params;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  // Get order details and card information
  const query = `
    SELECT o.*, t.* 
    FROM orders o 
    JOIN two_d_cards t ON o.cc_num = t.id 
    WHERE o.code = ? AND o.user = ? AND o.type = '2d card'
  `;

  db.query(query, [code, username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(results[0]);
  });
});

app.post('/api/2d-card/download', (req, res) => {
  const { username, transactionId } = req.body;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  // For testing, return a simple text file
  const cardData = `2D Card Details
Transaction ID: ${transactionId}
Card Type: Visa Credit
Card Number: 411111****1234
Expiry: 12/25
CVV: 123
Card Holder: JOHN DOE
Country: USA
State: CA
City: Los Angeles
ZIP: 90210
Level: Gold
Bank: Chase Bank
Price: $25.00

Downloaded on: ${new Date().toISOString()}`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="2d-card-${transactionId}.txt"`);
  res.send(cardData);
});

// 2D Card Purchase endpoint
app.post('/api/2d-card/purchase', (req, res) => {
  const { username, info } = req.body;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  if (!info || !Array.isArray(info)) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries - following the same pattern as regular credit cards
        const insertBuyedQuery = `
          INSERT INTO buyed (
            bin, cvv, yymm, country, bank, level, type, holder,
            city, state, zip, base, price, addr, email, phone, dob, mmn, sortCode,
            ip, checker, additionalInfo, ccnum, user, code, bins
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
        `;

        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;
        const updateTwoDCardQuery = `UPDATE two_d_cards SET user = ? WHERE id = ?`;
        const getUserRoleQuery = `SELECT role FROM users WHERE username = ?`;
        const insertOrderQuery = `INSERT INTO orders (code, quantity, total_price, user, type, cc_num,created) VALUES (?, 1, ?, ?, ?, ?,NOW())`;
        const insertTransactionQuery = `INSERT INTO transaction (code, method, memo, fee, amount, pay, befor, after, status, user) VALUES (?, '2D-CARD', ?, 0, ?, ?, ?, ?, 'paid', ?)`;
        const deleteFromCartQuery = `DELETE FROM two_d_cart WHERE user = ? AND id = ?`;

        // Calculate total price
        let totalPrice = 0;
        const type = '2d card';
        const code = generateTransactionId();
        
        const values = info.map(item => {
          totalPrice += item.price; // Sum up total price
          
          return [
            item.bin,           // `bin`
            item.cvv,           // `cvv`
            item.expiry,        // `yymm` (expiry date)
            item.country,       // `country`
            item.bankname,      // `bank`
            item.level,         // `level`
            item.cardType,      // `type`
            item.cardHolder,    // `holder`
            item.city,          // `city`
            item.state,         // `state`
            item.zip,           // `zip`
            item.base,          // `base`
            item.price,         // `price`
            item.addr || '',    // `addr`
            item.email || '',   // `email`
            item.phone || '',   // `phone`
            item.dob || '',     // `dob`
            item.mmn || '',     // `mmn`
            item.sortCode || '', // `sortCode`
            item.ip || '',      // `ip`
            item.checker || '', // `checker`
            item.additionalInfo || '', // `additionalInfo`
            item.id,            // `ccnum` (using card id)
            username,           // `user`
            code                // `code`
          ];
        });

        // Check if any card has already been bought
        const checkCardQuery = `SELECT user FROM two_d_cards WHERE id = ?`;
        const cardUsers = await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(checkCardQuery, [valueSet[23]], (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          })
        ));

        for (const cardUser of cardUsers) {
          if (cardUser[0] && cardUser[0].user !== null) {
            return res.status(400).send({ message: 'One or more cards have already been bought' });
          }
        }

        // Get user role
        const [userRole] = await new Promise((resolve, reject) => {
          connection.query(getUserRoleQuery, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        // Apply discount if user role is 'reseller'
        if (userRole.role === 'reseller') {
          totalPrice *= 0.5; // Apply 50% discount
        }

        // Insert into buyed table and update two_d_cards table
        await Promise.all(values.map(valueSet =>
          new Promise(async (resolve, reject) => {
            try {
              // Insert into buyed table
              await new Promise((resolveInsert, rejectInsert) => {
                connection.query(insertBuyedQuery, valueSet, (error, results) => {
                  if (error) {
                    rejectInsert(error);
                  } else {
                    resolveInsert(results);
                  }
                });
              });

              // Update two_d_cards table to mark as bought
              await new Promise((resolveUpdate, rejectUpdate) => {
                connection.query(updateTwoDCardQuery, [username, valueSet[23]], (error, results) => {
                  if (error) {
                    rejectUpdate(error);
                  } else {
                    resolveUpdate(results);
                  }
                });
              });

              resolve(valueSet[23]); // Return the card ID
            } catch (error) {
              reject(error);
            }
          })
        ));

        // Check balance and update if sufficient
        const [user] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (user.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }

        // Insert transaction record
        await new Promise((resolve, reject) => {
          connection.query(insertTransactionQuery, [code, "2D-CARD || PURCHASE 1pcs", totalPrice, totalPrice, user.balance, user.balance - totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Update user balance
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Insert order records for each card
        await Promise.all(values.map((valueSet, index) =>
          new Promise((resolve, reject) => {
            connection.query(insertOrderQuery, [code, info[index].price, username, type, valueSet[23]], (error) => {
              if (error) reject(error);
              resolve();
            });
          })
        ));

        // Remove from cart
        await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(deleteFromCartQuery, [username, valueSet[23]], (error) => {
              if (error) reject(error);
              resolve();
            });
          })
        ));

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return connection.rollback(() => {
              res.status(500).send({ message: 'Transaction commit failed' });
            });
          }

          res.send({ message: '2D Card purchase successful', transactionId: code });
        });
      } catch (error) {
        console.error('Transaction error:', error);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});

app.get('/api/admin/users', (req, res) => {
  const query = `select * from users`
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/api/card/cart', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  let query = 'SELECT * FROM cart WHERE user = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/api/card/order', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  let query = 'SELECT * FROM orders WHERE user = ? AND type = ?';
  db.query(query, [username, "credit card"], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    //console.log(results)
    res.json(results);
  });  
});
app.get('/api/sock/order', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  let query = 'SELECT * FROM orders WHERE user = ? and type = ?';
  db.query(query, [username,"sock"], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/api/billing/history', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  let query = 'SELECT * FROM transaction WHERE user = ?';
  db.query(query, [username,"sock"], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.get('/api/ticket', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  let query = 'SELECT * FROM ticket WHERE user = ?';
  db.query(query, [username,"sock"], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
// Add 2D card to cart
app.post("/api/2d-card/addcart", (req, res) => {
  const { username, info } = req.body;
  let item = info[0];

  console.log('2D Card AddCart - Received data:', { username, item });

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  // Query to check if the item already exists in the cart for the user
  const checkQuery = `
    SELECT * FROM two_d_cart WHERE bin = ? AND cardHolder = ? AND user = ?
  `;

  const checkValues = [item.bin || item.BIN, item.cardHolder || item.holder, username];

  db.query(checkQuery, checkValues, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    // If item already exists, send a message
    if (results.length > 0) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    // If item doesn't exist, proceed to insert it into the cart
    const insertQuery = `
      INSERT INTO two_d_cart(
        bin, card_type, cardHolder, expiry, price, cvv, country, state, city, zip, level, bankname, base, user , balance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
    `;

    const insertValues = [
      item.bin || item.BIN,           // `bin`
      item.cardType || item.card_type || item.type,      // `card_type`
      item.cardHolder || item.cardHolder || item.holder,    // `cardHolder`
      item.expiry || item.exp || item.yymm,        // `expiry`
      item.price || 0,         // `price`
      item.cvv || item.CVV,           // `cvv`
      item.country || item.COUNTRY,       // `country`
      item.state || item.STATE,         // `state`
      item.city || item.CITY,          // `city`
      item.zip || item.ZIP,           // `zip`
      item.level || item.LEVEL,         // `level`
      item.bankname || item.bank || item.bankName,      // `bankname`
      item.base || item.BASE,          // `base`
      username  ,          // `user`
      item.balance || item.BALANCE
    ];

    db.query(insertQuery, insertValues, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: '2D Card added to cart successfully', results });
    });
  });
});

app.post("/api/addcart", (req, res) => {
  const { username, info } = req.body; // Destructure both 'username' and 'info' from req.body
  let item = info[0];
  //console.log(item, "data");

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  // Query to check if the item already exists in the cart for the user
  const checkQuery = `
    SELECT * FROM cart WHERE bin = ? AND cvv = ? AND user = ?
  `;

  const checkValues = [item.bin, item.cvv, username];

  db.query(checkQuery, checkValues, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    // If item already exists, send a message
    if (results.length > 0) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    // If item doesn't exist, proceed to insert it into the cart
    const insertQuery = `
      INSERT INTO cart(
        bin, cvv, exp, country, bank, level, type, holderName,
        city, state, zip, base, price, addr, email, phone, dob, sortCode,
        ip, checker, additionalInfo, ccnum, user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const insertValues = [
      item.bin,        // `bin`
      item.cvv,        // `cvv`
      item.yymm,       // `yymm`
      item.country,    // `country`
      item.bank,       // `bank`
      item.level,      // `level`
      item.type,       // `type`
      item.holder,     // `holder`
      item.city,       // `city`
      item.state,      // `state`
      item.zip,        // `zip`
      item.base,       // `base`
      item.price,      // `price`
      item.addr,       // `addr`
      item.email,      // `email`
      item.phone,      // `phone`
      item.dob,        // `dob`  
      item.sortCode,   // `sortCode`
      item.ip,         // `ip`
      item.checker,    // `checker`
      item.additionalInfo, // `additionalInfo`
      item.ccnum,      // `ccnum`
      username
    ];

    db.query(insertQuery, insertValues, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Item added to cart successfully', results });
    });
  });
});

app.post("/api/order/remove", (req, res) => {
  const { username, info } = req.body; // Destructure both 'username' and 'info' from req.body
  let item = info[0];
  //console.log(item, "data");

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  // Updated query to include all columns in the 'cart' table
  const query = `
  DELETE FROM orders WHERE code = ? and user = ?;`;

  // Values to be inserted into the table
  const values = [// `additionalInfo`
    item.code,// `bins`
    username
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item removed from order successfully', results });
  });
});
// Remove 2D card from cart
app.post("/api/2d-card/cart/remove", (req, res) => {
  const { username, info } = req.body;
  let item = info[0];

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  console.log('Removing from cart:', { username, itemId: item.id });

  const query = `DELETE FROM two_d_cart WHERE id = ? AND user = ?`;

  const values = [item.id, username];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('Cart removal result:', { affectedRows: results.affectedRows, itemId: item.id });

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: '2D Card removed from cart successfully' });
  });
});

// 2D Card order remove endpoint (similar to CCS)
app.post("/api/2d-card/order/remove", (req, res) => {
  const { username, info } = req.body;
  let item = info[0];

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const query = `DELETE FROM orders WHERE code = ? AND user = ?`;

  const values = [item.code, username];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Order removed successfully', results });
  });
});

app.post("/api/cart/remove", (req, res) => {
  const { username, info } = req.body; // Destructure both 'username' and 'info' from req.body
  let item = info[0];
  //console.log(item, "data");

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  // Updated query to include all columns in the 'cart' table
  const query = `
  DELETE FROM cart WHERE ccnum = ? and user = ?;`;

  // Values to be inserted into the table
  const values = [// `additionalInfo`
    item.ccnum,// `bins`
    username
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item removed from cart successfully', results });
  });
});


app.post('/api/bins', (req, res) => {
  const { level, country, types, buyed, username, description } = req.body;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  if (buyed == true) { // Check if buyed is explicitly true
    let query = 'SELECT * FROM buyed WHERE bins = true AND user = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } else {
    let query = 'SELECT * FROM bins WHERE 1=1 AND user IS NULL ';


    if (level) query += ` AND level = '${level}'`;
    if (description) query += ` AND info = '${description}'`;
    if (country) query += ` AND country = '${country}'`;
    if (types) query += ` AND type = '${types}'`;

// console.log('Constructed Query:', query); // Log the constructed query
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      // console.log('Results:', results); // Log the results
      res.json(results);
    });
  }
});

app.post('/api/create/ticket', (req, res) => {
  const { subject, department, message, username } = req.body;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const query = 'INSERT INTO ticket (subject, department, message, user, status, answered) VALUES (?, ?, ?, ?, "opened", "pending")';
  
  db.query(query, [subject, department, message, username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    const mailOptions = {
      from: 'vclubunitedshop@gmail.com',
      to: 'vclubunitedshop@gmail.com',
      subject: `Ticket Details: ${subject}`,
      text: `Username: ${username}\nDepartment: ${department}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send({ message: 'Ticket created but email failed to send' });
      }

      return res.status(200).json({
        message: 'Ticket created and email sent successfully' // assuming `results` contains the ID of the inserted ticket
      });
    });
  });
});



app.post('/api/Proxies', (req, res) => {
  const { continent, state, city, zip, minprice, maxprice } = req.body;

  let query = 'SELECT * FROM proxies WHERE 1=1';

  if (continent) query += ` AND continent = '${continent}'`;
  if (state) query += ` AND state = '${state}'`;
  if (city) query += ` AND city = '${city}'`;
  if (zip) query += ` AND zip = '${zip}'`;
  if (minprice !== undefined && maxprice !== undefined) {
    query += ` AND price BETWEEN '${minprice}' AND '${maxprice}'`;
  }

  // //console.log('Constructed Query:', query); // Log the constructed query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    // //console.log('Results:', results); // Log the results
    res.json(results);
  });

});


app.post('/api/purchase', (req, res) => {
  const { username, info } = req.body;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  //console.log(info, "data");



  if (!info || !Array.isArray(info)) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction initiation error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction initiation failed' });
      }

      try {
        // Define queries
        const insertBuyedQuery = `
              INSERT INTO buyed (
 bin, cvv, yymm, country, bank, level, type, holder,
  city, state, zip, base, price, addr, email, phone, dob, mmn, sortCode,
  ip, checker, additionalInfo,ccnum, user, code,bins,created
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,0,?);
`;

        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;
        const updateCreditCardQuery = `UPDATE credit_card SET user = ? WHERE ccnum = ?`;
        const getUserRoleQuery = `SELECT role FROM users WHERE username = ?`;
        const updateorder = `insert into orders (code,quantity,total_price,user,type,cc_num,created) values(?,1,?,?,?,?,NOW())`;
        const updatetransaction = `insert into transaction (code,method,memo,fee,amount,pay,befor,after,status,user) values(?,'CCS',?,0,?,?,?,?,'paid',?)`
        // Calculate total price
        const updatecart = `DELETE FROM cart WHERE user = ? AND ccnum = ?`;
        let totalPrice = 0;
        let cc_num = 0;
        let type = 'credit card';
        const code =   generateTransactionId();
        const values = info.map(item => {
          totalPrice += item.price; // Sum up total price
          cc_num = item.ccnum;
          
          return [
            item.bin,        // `bin`
            item.cvv,        // `cvv`
            item.exp,       // `yymm`
            item.country,    // `country`
            item.bank,       // `bank`
            item.level,      // `level`
            item.type,       // `type`
            item.holderName,     // `holder`
            item.city,       // `city`
            item.state,      // `state`
            item.zip,        // `zip`
            item.base,       // `base`
            item.price,      // `price`
            item.addr,       // `addr`
            item.email,      // `email`
            item.phone,      // `phone`
            item.dob,        // `dob`
            item.mmn,        // `mmn`
            item.sortCode,   // `sortCode`
            item.ip,         // `ip`
            item.checker,    // `checker`
            item.additionalInfo, // `additionalInfo`
            item.ccnum,// `bins`
            username,
            code,
            Date.now()
          ];
        });

        // Check if any item has already been bought
        const checkCardQuery = `SELECT user FROM credit_card WHERE ccnum = ?`;
        const cardUsers = await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(checkCardQuery, [valueSet[23]], (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          })
        ));

        for (const cardUser of cardUsers) {
          if (cardUser[0] && cardUser[0].user !== null) {
            return res.status(400).send({ message: 'One or more cards have already been bought' });
          }
        }

        // Get user role
        const [userRole] = await new Promise((resolve, reject) => {
          connection.query(getUserRoleQuery, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        // Apply discount if user role is 'reseller'
        if (userRole.role === 'reseller') {
          totalPrice *= 0.5; // Apply 50% discount
        }

        // Insert purchase records
        await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(insertBuyedQuery, valueSet, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          })
        ));

        // Check balance and update if sufficient
        const [user] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (user.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }

        // Update user balance
       
        await new Promise((resolve, reject) => {
          connection.query(updatetransaction, [code,"CCS || PURCHASE 1pcs", totalPrice,totalPrice,user.balance,user.balance - totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });
        // Update credit card
        await new Promise((resolve, reject) => {
          connection.query(updateCreditCardQuery, [username, cc_num], (error) => {
            if (error) reject(error);
            resolve();
          });
        });
        await new Promise((resolve, reject) => {
          connection.query(updatecart, [username, cc_num], (error) => {
            if (error) reject(error);
            resolve();
          });
        });
        await new Promise((resolve, reject) => {
          connection.query(updateorder, [code, totalPrice, username, type, cc_num], (error) => {
            if (error) reject(error);
            resolve();
          });
        }); 
        // Commit transaction
        connection.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return connection.rollback(() => {
              res.status(500).send({ message: 'Transaction commit failed' });
            });
          }

          res.send({ message: 'Transaction successful' });
        });
      } catch (error) {
        console.error('Transaction error:', error);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});

app.post('/api/purchase_bins', (req, res) => {
  const { username, info } = req.body;

  //console.log(req.body, username);

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  if (!info || !Array.isArray(info)) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries
        const insertBuyedQuery = `
          INSERT INTO buyed (
            bin, country, price, level, brand, type, bins, user, info
          ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?);
        `;

        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;
        const updateCreditCardQuery = `UPDATE bins SET user = ? WHERE bin = ?`;
        const updateTransactionCardQuery = `insert into transaction (code,method,memo,fee,amount,pay,befor,after,status,user) values(?,'BIN',?,0,?,?,?,?,'paid',?)`;

        // Calculate total price
        let totalPrice = 0;
        const type = "bin";
        const code =   generateTransactionId();
        const values = info.map(item => {
          totalPrice += item.price; // Sum up total price
          return [
            item.bin, item.country, item.price, item.level, item.brand, item.type, username, item.info
          ];
        });

        // Check if any bin has already been bought
        const checkBinQuery = `SELECT user FROM bins WHERE bin = ?`;
        const binUsers = await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(checkBinQuery, [valueSet[0]], (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
          })
        ));

        for (const binUser of binUsers) {
          if (binUser[0] && binUser[0].user !== null) {
            return res.status(400).send({ message: 'One or more bins have already been bought' });
          }
        }

           // Apply discount if user role is 'reseller'
        const [userRole] = await new Promise((resolve, reject) => {
          connection.query('SELECT role FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (userRole.role === 'reseller') {
          totalPrice *= 0.5; // Apply 50% discount
        }

        // Insert purchase records
        await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(insertBuyedQuery, valueSet, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          })
        ));

        // Check balance and update if sufficient
        const [user] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (user.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }

        // Update user balance
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Update bins
        await Promise.all(info.map(item =>
          new Promise((resolve, reject) => {
            connection.query(updateCreditCardQuery, [username, item.bin], (error) => {
              if (error) reject(error);
              resolve();
            });
          })
        ));

        // Record the transaction
        await new Promise((resolve, reject) => {
          connection.query(updateTransactionCardQuery, [code,"BIN || PURCHASE 1pcs", totalPrice,totalPrice,user.balance,user.balance - totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return connection.rollback(() => {
              res.status(500).send({ message: 'Transaction failed' });
            });
          }

          res.send({ message: 'Transaction successful' });
        });
      } catch (error) {
        console.error('Transaction error:', error);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});


app.post('/api/purchase_proxies', (req, res) => {
  const { items, username } = req.body;


  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }


  if (!items || !Array.isArray(items)) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries
        const insertBuyedQuery = `
          INSERT INTO buyed (
            id, , country, price, level, brand, type,bins
          ) VALUES (?,?,?,?,?,?,?,1);
        `;

        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;

        // Calculate total price
        let totalPrice = 0;
        const values = items.map(item => {
          totalPrice += item.price; // Sum up total price
          return [
            item.id, item.bin, item.country, item.price, item.level, item.brand, item.type
          ];
        });

        // Insert purchase records
        await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(insertBuyedQuery, valueSet, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          })
        ));

        // Check balance and update if sufficient
        const [user] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (user.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }

        // Update user balance
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return connection.rollback(() => {
              res.status(500).send({ message: 'Transaction failed' });
            });
          }

          res.send({ message: 'Transaction successful' });
        });
      } catch (error) {
        console.error('Transaction error:', error);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});

app.get('/api/view/:id', (req, res) => {
  const username = req.query.username;
  const id = req.params.id;

  //console.log(username,id);
  

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const transactionQuery = 'SELECT * FROM ticket WHERE id = ?';
  db.query(transactionQuery, [id], (err, results) => {
    if (err) {
      console.error('Error fetching ticket: ', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Ticket not found' });
    }

    // If ticket is found, send the data
    return res.status(200).send(results[0]);
  });
});
app.get('/api/order/view/:id', (req, res) => {
  const username = req.query.username;
  const id = req.params.id;

  //console.log(username,id);
  

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const transactionQuery = 'SELECT * FROM buyed WHERE code = ?';
  db.query(transactionQuery, [id], (err, results) => {
    if (err) {
      console.error('Error fetching ticket: ', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'details not found' });
    }

    // If ticket is found, send the data
    return res.status(200).send(results[0]);
  });
});

app.get('/api/orders/:id', (req, res) => {
  const username = req.query.username;
  const transactionId = req.params.id;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const transactionQuery = 'SELECT * FROM orders WHERE code = ?';
  db.query(transactionQuery, [transactionId], (err, results) => {
    if (err) {
      console.error('Error fetching transaction:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('Order not found');
    }

    const transaction = results[0];

    if (transaction.type === 'credit card') {
      const creditCardQuery = 'SELECT * FROM buyed WHERE code = ? AND user = ? AND bins = 0';
      db.query(creditCardQuery, [transactionId, username], (err, cardResults) => {
        if (err) {
          console.error('Error fetching credit card info:', err);
          return res.status(500).send('Internal Server Error');
        }

        if (cardResults.length === 0) {
          return res.status(404).send('Credit card information not found');
        }

        const card = cardResults[0]; // Assuming you get one record

        // Prepare CSV data
        const csvData = [
          [
            card.ccnum || '',
            card.yymm || '',
            card.cvv || '',
            card.holder || '',
            card.addr || '',
            card.city || '',
            card.state || '',
            card.zip || '',
            card.phone || ''
          ]
        ];

        // Convert CSV data to string
        stringify(csvData, { header: false }, (err, output) => {
          if (err) {
            console.error('Error generating CSV:', err);
            return res.status(500).send('Internal Server Error');
          }

          // Set headers for CSV file download
          res.setHeader('Content-Disposition', `attachment; filename=order_${transactionId}.csv`);
          res.setHeader('Content-Type', 'text/csv');

          // Send CSV data
          res.send(output);
        });
      });
    } else {
      res.status(400).send('Transaction type is not credit card');
    }
  });
});


// Route to get user details
app.get('/api/profile', (req, res) => {
  const user = req.query.username;
  const sql = 'SELECT username, email, created_at FROM users WHERE username = ?';

  db.query(sql, [user], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  });
});

// Route to update the password
app.post('/api/profile/password', (req, res) => {

  const { currentPassword, newPassword, username } = req.body;

  // Check current password
  const checkSql = 'SELECT password FROM users WHERE username = ?';
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0 || results[0].password !== currentPassword) {
      return res.status(401).send({ message: 'Current password is incorrect' });
    }

    // Update to new password
    const updateSql = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(updateSql, [newPassword, username], (err, updateResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }

      res.status(200).send({ message: 'Password updated successfully' });
    });
  });
});
app.get('/api/checker', (req, res) => {
  const username = req.query.username;
  const sql = 'SELECT * FROM buyed WHERE user = ?';

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      res.status(200).send(results[0]);
      // //console.log(results);

    } else {
      res.status(404).send({ message: 'User not found' });
    }
  });
});
app.post('/api/send-email', (req, res) => {
  const emailData = req.body;

  const mailOptions = {
    from: 'vclubunitedshop@gmail.com',
    to: 'vclubunitedshop@gmail.com',  // Recipient's email address
    subject: 'Credit Details', // Subject of the email
    text: `Here are the details of the Credit Card For Checking For User ${emailData.username}:
    
    BIN: ${emailData.bin}
    Exp Date: ${emailData.time}
    First Name: ${emailData.firstName}
    Country: ${emailData.country}
    State: ${emailData.state}
    City: ${emailData.city}
    ZIP: ${emailData.zip}
    Info: ${emailData.info}
    Address: ${emailData.address}
    BIN Info: ${emailData.binInfo}
    Base: ${emailData.base}
    Valid Percent: ${emailData.validPercent}
    Refundable: ${emailData.refundable ? 'Yes' : 'No'}
    Price: ${emailData.price}$`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    //console.log('Email sent: ' + info.response);
    res.status(200).send({ message: 'Email sent successfully!' });
  });
});

app.post("/api/add-card", (req, res) => {
  const {
    ccnum,
    cvv,
    exp,
    bin,
    country,
    state,
    city,
    zip,
    bankName,
    level,
    brand,
    types,
    bases,
    price,
    address,
    binfo, email, phone, dob, name, sort_code,
    ip,
    checker
  } = req.body;

  

  const sql = `
    INSERT INTO credit_card (
      ccnum, cvv, yymm, bin, country, state, city, zip,
      bank, level, type, base, price,addr,additionalInfo, email, phone, dob,holder, mmn ,sortCode	,ip,checker,user
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?,?, ?,?,'VCLUB',?,?,?,NULL)
  `;
  db.query(sql, [
    ccnum, cvv, exp, bin, country, state, city, zip,
    bankName, level, types, bases, price, address, binfo, email, phone, dob, name,sort_code,ip,checker
  ], (err, result) => {
    if (err) {
      console.error("Error inserting card data into the database:", err);
      return res.status(500).json({ message: "Error inserting card data into the database" });
    }
    res.status(200).json({ message: "Card data added successfully" });
    //console.log(result);

  });
});

// Route to add BIN data
app.post("/api/add-bin", (req, res) => {
  const {
    bin,
    country,
    types,
    level,
    price,
    brand,
    description
  } = req.body;

  const sql = `
    INSERT INTO bins (
      bin, country, level, type,brand,info, price,user
    ) VALUES (?, ?, ?, ?, ?,?,?,NULL)
  `;
  db.query(sql, [
    bin, country, level, types,brand,description, price
  ], (err, result) => {
    if (err) {
      console.error("Error inserting BIN data into the database:", err);
      return res.status(500).json({ message: "Error inserting BIN data into the database" });
    }
    res.status(200).json({ message: "BIN data added successfully" });
  });
});
app.post('/api/add-seller', (req, res) => {
  let { user, role, price } = req.body;


  // Validate input
  if (!user || role === undefined || price === undefined) {
    return res.status(400).send({ message: 'Username, new role, and a valid balance are required' });
  }
  if (isNaN(price)) {
    return res.status(400).send({ message: 'Invalid balance value' });
  }
  const updateRoleQuery = `
    UPDATE users
    SET role = ?
    WHERE username = ?;
  `;

  const updateBalanceQuery = `
    UPDATE users
    SET balance = balance - ?
    WHERE username = ?;
  `;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction initiation error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction initiation failed' });
      }

      try {
        // Log the queries and parameters
        //console.log('Executing updateRoleQuery:', updateRoleQuery);
        //console.log('With parameters:', [role, user]);

        await new Promise((resolve, reject) => {
          connection.query(updateRoleQuery, [role, user], (error) => {
            if (error) {
              console.error('Error updating role:', error.message);
              reject(error);
            } else {
              resolve();
            }
          });
        });
        const [users] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [user], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (users.balance < price) {
          throw new Error('Insufficient balance');
        }
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [price, user], (error) => {
            if (error) {
              console.error('Error updating balance:', error.message);
              reject(error);
            } else {
              resolve();
            }
          });
        });

        connection.commit((err) => {
          if (err) {
            console.error('Commit error:', err);
            connection.rollback(() => {
              res.status(500).send({ message: 'Transaction commit failed' });
            });
          } else {
            res.send({ message: 'User role and balance updated successfully' });
          }
        });
      } catch (error) {
        console.error('Transaction error:', error.message);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});
app.get('/api/payments', (req, res) => {
  const user = req.query.username;
  const sql = 'SELECT * FROM payment WHERE username = ?';
  //console.log(`Fetching payments for user: ${user}`);

  db.query(sql, [user], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Always return an array, even if empty
    console.log(results);
    
    res.status(200).json(results);
  });
});
app.get('/api/all-payments', (req, res) => {
  const sql = 'SELECT * FROM payment';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json(results);
  });
});

app.put('/api/update-payment', (req, res) => {
  const { id, amount, status, username } = req.body;

  if (!id || !amount || !status || !username) {
    return res.status(400).json({ message: 'Missing data' });
  }

  const amountNum = parseFloat(amount);

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Connection error:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        console.error('Transaction error:', err);
        return res.status(500).json({ message: 'Transaction error' });
      }

      // 1. Check if the user has any previous paid payments
      const checkQuery = 'SELECT COUNT(*) as paidCount FROM payment WHERE username = ? AND status = "paid" AND id != ?';
      connection.query(checkQuery, [username, id], (err, checkResult) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error('Check error:', err);
            res.status(500).json({ message: 'Failed to check user payment history' });
          });
        }

        const hasPreviousPayments = checkResult[0].paidCount > 0;

        // Calculate balance after deduction
        let balanceToAdd = 0;
        if (status === 'paid') {
          if (hasPreviousPayments) {
            balanceToAdd = amountNum * 0.97; // Deduct 3%
          } else {
            const totalDeduction = 50 + (amountNum * 0.03); // 50 + 3%
            balanceToAdd = amountNum - totalDeduction;
          }
        }

        // 2. Update payment
        const updatePayment = 'UPDATE payment SET amount = ?, status = ? WHERE id = ?';
        connection.query(updatePayment, [amount, status, id], (err1, result1) => {
          if (err1) {
            return connection.rollback(() => {
              connection.release();
              console.error('Payment update failed:', err1);
              res.status(500).json({ message: 'Failed to update payment' });
            });
          }

          if (status === 'paid') {
            // 3. Update user balance
            const updateBalance = 'UPDATE users SET balance = balance + ?' +
              (hasPreviousPayments ? '' : ', access = "yes"') +
              ' WHERE username = ?';
            connection.query(updateBalance, [balanceToAdd, username], (err2, result2) => {
              if (err2) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Balance update failed:', err2);
                  res.status(500).json({ message: 'Failed to update balance' });
                });
              }

              // 4. Commit
              connection.commit((err3) => {
                if (err3) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error('Commit failed:', err3);
                    res.status(500).json({ message: 'Commit failed' });
                  });
                }

                connection.release();
                res.status(200).json({
                  message: `Payment updated. Balance increased by $${balanceToAdd.toFixed(2)}.` +
                    (hasPreviousPayments ? '' : ' Access granted.')
                });
              });
            });
          } else {
            // If not paid, just commit the update
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Commit error:', err);
                  res.status(500).json({ message: 'Commit error' });
                });
              }

              connection.release();
              res.status(200).json({ message: 'Payment updated (no balance change)' });
            });
          }
        });
      });
    });
  });
});






// Admin endpoint to add a new 2D card
app.post('/api/admin/2dcard/add', (req, res) => {
  const {
    bin, card_type, cardHolder, expiry, price, cvv, country, state, city, zip, level, bankname, base, balance ,address
  } = req.body;

  // Basic validation (add more as needed)
  if (!bin || !card_type || !cardHolder || !expiry || !price || !cvv || !country || !state || !city || !zip || !level || !bankname || !base || !address) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `INSERT INTO two_d_cards (bin, card_type, cardHolder, expiry, price, cvv, country, state, city, zip, level, bankname, base,addr, balance, user)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, NULL)`;
  const values = [bin, card_type, cardHolder, expiry, price, cvv, country, state, city, zip, level, bankname, base,address, balance || 0];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json({ message: '2D card added successfully', id: results.insertId });
  });
});

// Refund Request API Endpoints

// Create refund request
app.post('/api/refund/request', (req, res) => {
  const { orderId, username, cardNumber, cardHolder, price } = req.body;

  if (!orderId || !username || !cardNumber) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  // Check if refund request already exists
  const checkQuery = 'SELECT * FROM refund_requests WHERE order_id = ? AND username = ?';
  db.query(checkQuery, [orderId, username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).send({ message: 'Refund request already exists for this order' });
    }

    // Check user's refund count
    const checkRefundQuery = 'SELECT refund FROM users WHERE username = ?';
    db.query(checkRefundQuery, [username], (err, userResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }

      if (userResults.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }

      const userRefundCount = userResults[0].refund || 0;
      if (userRefundCount <= 0) {
        return res.status(400).send({ message: 'No refunds available. You have used all your refund credits.' });
      }

      // Use database transaction to ensure atomicity
      db.getConnection((err, connection) => {
        if (err) {
          console.error('Connection error:', err);
          return res.status(500).send({ message: 'Database connection error' });
        }

        connection.beginTransaction(async (err) => {
          if (err) {
            connection.release();
            console.error('Transaction error:', err);
            return res.status(500).send({ message: 'Transaction error' });
          }

          try {
            // Decrement user's refund count
            const updateRefundQuery = 'UPDATE users SET refund = refund - 1 WHERE username = ? AND refund > 0';
            connection.query(updateRefundQuery, [username], (err, updateResults) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Error updating refund count:', err);
                  res.status(500).send({ message: 'Database error' });
                });
              }

              if (updateResults.affectedRows === 0) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(400).send({ message: 'No refunds available. You have used all your refund credits.' });
                });
              }

              // Create refund request
              const insertQuery = 'INSERT INTO refund_requests (order_id, username, card_number, card_holder, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
              connection.query(insertQuery, [orderId, username, cardNumber, cardHolder, price || 0, 'PENDING'], (err, results) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error('Database error:', err);
                    res.status(500).send({ message: 'Database error' });
                  });
                }

                // Send email notification to admin
                const mailOptions = {
                  from: 'vclubunitedshop@gmail.com',
                  to: 'vclubunitedshop@gmail.com',
                  subject: 'New Refund Request',
                  text: `A new refund request has been submitted:
                  
Order ID: ${orderId}
Username: ${username}
Card Number: ${cardNumber}
Card Holder: ${cardHolder}
Price: $${price || 0}
Status: PENDING
Remaining Refunds: ${userRefundCount - 1}

Please review this request in the admin panel.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error('Error sending email:', error);
                  } else {
                    console.log('Refund request email sent:', info.response);
                  }
                });

                // Commit transaction
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error('Commit error:', err);
                      res.status(500).send({ message: 'Transaction error' });
                    });
                  }

                  connection.release();
                  res.status(200).send({ 
                    message: 'Refund request submitted successfully',
                    remainingRefunds: userRefundCount - 1
                  });
                });
              });
            });
          } catch (error) {
            return connection.rollback(() => {
              connection.release();
              console.error('Transaction error:', error);
              res.status(500).send({ message: 'Transaction error' });
            });
          }
        });
      });
    });
  });
});

// Check refund status
app.get('/api/refund/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { username } = req.query;

  if (!orderId || !username) {
    return res.status(400).send({ message: 'Missing required parameters' });
  }

  const query = 'SELECT status FROM refund_requests WHERE order_id = ? AND username = ?';
  db.query(query, [orderId, username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(200).send({ status: 'NO REFUND' });
    }

    res.status(200).send({ status: results[0].status });
  });
});

// Get user's refund count
app.get('/api/refund/count', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ message: 'Username is required' });
  }

  const query = 'SELECT refund FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ refundCount: results[0].refund || 0 });
  });
});

// Get all refund requests (admin only)
app.get('/api/admin/refund-requests', (req, res) => {
  const query = `
    SELECT rr.*, u.email, u.refund as userRefundCount
    FROM refund_requests rr 
    LEFT JOIN users u ON rr.username = u.username 
    ORDER BY rr.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    res.status(200).send(results);
  });
});

// Get all tickets (admin only)
app.get('/api/admin/tickets', (req, res) => {
  const query = `
    SELECT * FROM ticket 
    ORDER BY date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Comprehensive address data for multiple countries (using exact database country names)
const addressData = {
  'UNITED STATES': [
    { state: 'California', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento'], zips: ['90001', '92101', '95112', '94102', '93701', '95814'] },
    { state: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'], zips: ['77002', '75201', '73301', '78205', '76102', '79901'] },
    { state: 'New York', cities: ['New York', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers'], zips: ['10001', '14201', '14604', '12207', '13201', '10701'] },
    { state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Hialeah'], zips: ['33101', '32801', '33602', '32202', '33701', '33010'] },
    { state: 'Illinois', cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield'], zips: ['60601', '60502', '61101', '60435', '60540', '62701'] }
  ],

  'INDIA': [
    { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'], zips: ['400001', '411001', '440001', '422001', '431001', '413001'] },
    { state: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Kalaburagi'], zips: ['560001', '570001', '575001', '580020', '590001', '585101'] },
    { state: 'Delhi', cities: ['New Delhi', 'Dwarka', 'Saket', 'Rohini', 'Karol Bagh', 'Lajpat Nagar'], zips: ['110001', '110075', '110017', '110085', '110005', '110024'] },
    { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'], zips: ['600001', '641001', '625001', '620001', '636001', '627001'] },
    { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'], zips: ['380001', '395001', '390001', '360001', '364001', '361001'] }
  ],

  'UNITED KINGDOM': [
    { state: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield'], zips: ['EC1A', 'M1', 'B1', 'L1', 'LS1', 'S1'] },
    { state: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Stirling', 'Perth'], zips: ['EH1', 'G1', 'AB10', 'DD1', 'FK8', 'PH1'] },
    { state: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Caerphilly'], zips: ['CF10', 'SA1', 'NP10', 'LL11', 'CF62', 'CF83'] }
  ],

  'CANADA': [
    { state: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton', 'London'], zips: ['M5A', 'K1A', 'L5B', 'L8P', 'L6T', 'N6A'] },
    { state: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Kelowna', 'Burnaby', 'Richmond'], zips: ['V5K', 'V8W', 'V3T', 'V1Y', 'V5A', 'V6X'] },
    { state: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'], zips: ['H1A', 'G1A', 'H7A', 'J8P', 'J4K', 'J1H'] }
  ],

  'AUSTRALIA': [
    { state: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Parramatta', 'Liverpool', 'Penrith'], zips: ['2000', '2300', '2500', '2150', '2170', '2750'] },
    { state: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Warrnambool'], zips: ['3000', '3220', '3350', '3550', '3630', '3280'] },
    { state: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns', 'Townsville', 'Toowoomba', 'Rockhampton'], zips: ['4000', '4217', '4870', '4810', '4350', '4700'] }
  ],

  'GERMANY': [
    { state: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Würzburg', 'Ingolstadt'], zips: ['80331', '90402', '86150', '93047', '97070', '85049'] },
    { state: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum'], zips: ['50667', '40213', '44135', '45127', '47051', '44787'] },
    { state: 'Baden-Württemberg', cities: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg', 'Ulm'], zips: ['70173', '68159', '76133', '79098', '69117', '89073'] }
  ],

  'FRANCE': [
    { state: 'Île-de-France', cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Nanterre'], zips: ['75001', '92100', '93200', '95100', '93100', '92000'] },
    { state: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Saint-Étienne', 'Grenoble', 'Villeurbanne', 'Clermont-Ferrand', 'Valence'], zips: ['69001', '42000', '38000', '69100', '63000', '26000'] },
    { state: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes'], zips: ['13001', '06000', '83000', '13100', '84000', '06400'] }
  ],

  'JAPAN': [
    { state: 'Tokyo', cities: ['Shibuya', 'Shinjuku', 'Chiyoda', 'Minato', 'Toshima', 'Nakano'], zips: ['150-0002', '160-0022', '100-0001', '105-0001', '171-0022', '164-0001'] },
    { state: 'Osaka', cities: ['Osaka', 'Sakai', 'Higashiosaka', 'Toyonaka', 'Suita', 'Ibaraki'], zips: ['530-0001', '590-0078', '577-0011', '560-0001', '564-0001', '567-0001'] },
    { state: 'Kanagawa', cities: ['Yokohama', 'Kawasaki', 'Sagamihara', 'Yokosuka', 'Fujisawa', 'Atsugi'], zips: ['220-0001', '210-0001', '252-0001', '238-0001', '251-0001', '243-0001'] }
  ],

  'BRAZIL': [
    { state: 'São Paulo', cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco'], zips: ['01000-000', '07000-000', '13000-000', '09700-000', '09000-000', '06000-000'] },
    { state: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo'], zips: ['20000-000', '24400-000', '25000-000', '26000-000', '24000-000', '26100-000'] },
    { state: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros'], zips: ['30000-000', '38400-000', '32000-000', '36000-000', '32600-000', '39400-000'] }
  ],

  'ITALY': [
    { state: 'Lazio', cities: ['Rome', 'Latina', 'Frosinone', 'Viterbo', 'Rieti'], zips: ['00100', '04100', '03100', '01100', '02100'] },
    { state: 'Lombardy', cities: ['Milan', 'Bergamo', 'Brescia', 'Como', 'Cremona'], zips: ['20100', '24100', '25100', '22100', '26100'] },
    { state: 'Campania', cities: ['Naples', 'Salerno', 'Caserta', 'Avellino', 'Benevento'], zips: ['80100', '84100', '81100', '83100', '82100'] }
  ],

  'SPAIN': [
    { state: 'Madrid', cities: ['Madrid', 'Alcalá de Henares', 'Móstoles', 'Fuenlabrada', 'Leganés'], zips: ['28001', '28801', '28931', '28941', '28911'] },
    { state: 'Catalonia', cities: ['Barcelona', 'L\'Hospitalet', 'Badalona', 'Sabadell', 'Terrassa'], zips: ['08001', '08901', '08911', '08201', '08221'] },
    { state: 'Andalusia', cities: ['Seville', 'Málaga', 'Córdoba', 'Granada', 'Cádiz'], zips: ['41001', '29001', '14001', '18001', '11001'] }
  ],

  'NETHERLANDS': [
    { state: 'North Holland', cities: ['Amsterdam', 'Haarlem', 'Zaanstad', 'Amstelveen', 'Hoofddorp'], zips: ['1000', '2000', '1500', '1180', '2130'] },
    { state: 'South Holland', cities: ['Rotterdam', 'The Hague', 'Leiden', 'Dordrecht', 'Zoetermeer'], zips: ['3000', '2500', '2300', '3300', '2700'] },
    { state: 'Utrecht', cities: ['Utrecht', 'Amersfoort', 'Nieuwegein', 'Veenendaal', 'Zeist'], zips: ['3500', '3800', '3430', '3900', '3700'] }
  ]
};

// External API fallback for unknown countries (optional)
async function fetchAddressFromAPI(country) {
  try {
    // Using a free API service for random addresses
    const response = await fetch(`https://random-data-api.com/api/address/random_address?size=1`);
    if (response.ok) {
      const data = await response.json();
      return {
        address: `${data.street_address}`,
        city: data.city,
        state: data.state,
        zip: data.zip_code
      };
    }
  } catch (error) {
    console.log('External API fallback failed:', error.message);
  }
  return null;
}

// Util: Random realistic address generator by country
function generateRandomAddressByCountry(country) {
  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const streetNames = ['Main St', 'Oak Ave', 'Maple Dr', 'Pine St', 'Cedar Ln', 'Elm St', 'Park Ave', 'Lakeview Dr', 'First St', 'Second Ave', 'Third Blvd', 'Fourth Rd'];
  const houseNum = Math.floor(Math.random() * 899) + 100; // 100-999
  const addressLine = `${houseNum} ${randomPick(streetNames)}`;

  if (!country) {
    return { address: addressLine, city: 'Metro City', state: 'State', zip: '00000' };
  }

  // Debug logging
  console.log(`Generating address for country: "${country}"`);
  
  // Direct exact match with database country names
  if (addressData[country]) {
    console.log(`Exact match found for: ${country}`);
    const region = randomPick(addressData[country]);
    return {
      address: addressLine,
      city: randomPick(region.cities),
      state: region.state,
      zip: randomPick(region.zips)
    };
  }

  // Fallback: try case-insensitive matching
  const normalized = country.toLowerCase().trim();
  for (const [countryKey, states] of Object.entries(addressData)) {
    if (normalized === countryKey.toLowerCase()) {
      console.log(`Case-insensitive match found for: ${countryKey}`);
      const region = randomPick(states);
      return {
        address: addressLine,
        city: randomPick(region.cities),
        state: region.state,
        zip: randomPick(region.zips)
      };
    }
  }

  console.log(`No match found for country: "${country}", using generic address`);
  // Default generic for unknown countries
  return { address: addressLine, city: 'Central', state: 'Region', zip: '00000' };
}

// Debug endpoint to see what countries are in the database
app.get('/api/admin/addresses/debug-countries', (req, res) => {
  const sql = 'SELECT DISTINCT country, COUNT(*) as count FROM credit_card WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC';
  db.query(sql, [], (err, results) => {
    if (err) {
      console.error('Debug countries query failed:', err);
      return res.status(500).send({ message: 'Database error while fetching countries' });
    }
    return res.status(200).send({ 
      message: 'Countries found in credit_card table',
      countries: results,
      totalCountries: results.length
    });
  });
});

// Admin: Clear all address fields (preserve country)
app.post('/api/admin/addresses/clear', (req, res) => {
  // Only operate on credit_card table
  const sql = 'UPDATE credit_card SET addr = NULL, city = NULL, state = NULL, zip = NULL';
  db.query(sql, [], (err) => {
    if (err) {
      console.error('Clear addresses (credit_card) error:', err);
      return res.status(500).send({ message: 'Database error while clearing addresses in credit_card' });
    }
    return res.status(200).send({ message: 'All address fields cleared in credit_card (country preserved).' });
  });
});

// Admin: Generate random addresses per entry, based on existing country
app.post('/api/admin/addresses/generate', async (req, res) => {
  // Only operate on credit_card table
  const selectSql = 'SELECT id, country FROM credit_card';
  db.query(selectSql, async (err, rows) => {
    if (err) {
      console.error('Select from credit_card failed:', err);
      return res.status(500).send({ message: 'Database error while reading credit_card' });
    }
    if (!rows || rows.length === 0) {
      return res.status(200).send({ message: 'No rows in credit_card to update.' });
    }

    let processed = 0;
    let failed = false;
    let apiUsed = false;

    for (const row of rows) {
      if (failed) break;
      
      let addr = generateRandomAddressByCountry(row.country || '');
      
      // If we got a generic address and country exists, try external API
      if (addr.city === 'Central' && row.country && !addressData[row.country]) {
        try {
          const apiAddr = await fetchAddressFromAPI(row.country);
          if (apiAddr) {
            addr = apiAddr;
            apiUsed = true;
          }
        } catch (error) {
          console.log('API fallback failed for country:', row.country);
        }
      }

      const updateSql = 'UPDATE credit_card SET addr = ?, city = ?, state = ?, zip = ? WHERE id = ?';
      const params = [addr.address, addr.city, addr.state, addr.zip, row.id];
      
      await new Promise((resolve, reject) => {
        db.query(updateSql, params, (uErr) => {
          if (uErr) {
            failed = true;
            console.error('Update credit_card failed:', uErr);
            reject(uErr);
          } else {
            processed += 1;
            resolve();
          }
        });
      });
    }

    if (failed) {
      return res.status(500).send({ message: 'Failed generating addresses for credit_card' });
    }

    const message = apiUsed 
      ? `Random addresses generated for ${processed} credit_card entries. Some used external API for unknown countries.`
      : `Random addresses generated for ${processed} credit_card entries based on country.`;
    
    return res.status(200).send({ message });
  });
});

// Admin answer ticket
app.post('/api/admin/ticket/answer', (req, res) => {
  const { ticketId, answer, adminUsername } = req.body;
  if (!ticketId || !answer || !adminUsername) {
    return res.status(400).send({ message: 'Missing required fields' });
  }
  const getTicketQuery = 'SELECT * FROM ticket WHERE id = ?';
  db.query(getTicketQuery, [ticketId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: 'Ticket not found' });
    }
    const ticket = results[0];
    const updateQuery = `
      UPDATE ticket 
      SET answered = 'replied', 
          status = 'closed', 
          author = ?, 
          comments = ? 
      WHERE id = ?
    `;
    db.query(updateQuery, [adminUsername, answer, ticketId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Database error:', updateErr);
        return res.status(500).send({ message: 'Failed to update ticket' });
      }
      res.send({ message: 'Ticket answered successfully' });
    });
  });
});

// Admin action on refund request (approve/reject)
app.post('/api/admin/refund-action', (req, res) => {
  const { requestId, action, username } = req.body; // action: 'approve' or 'reject'

  if (!requestId || !action || !username) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Connection error:', err);
      return res.status(500).send({ message: 'Database connection error' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        return res.status(500).send({ message: 'Transaction error' });
      }

      try {
        // Get refund request details
        const getRequestQuery = 'SELECT * FROM refund_requests WHERE id = ?';
        connection.query(getRequestQuery, [requestId], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error getting refund request:', err);
              res.status(500).send({ message: 'Database error' });
            });
          }

          if (results.length === 0) {
            return connection.rollback(() => {
              connection.release();
              res.status(404).send({ message: 'Refund request not found' });
            });
          }

          const refundRequest = results[0];
          const newStatus = action === 'approve' ? 'REFUNDED' : 'REJECTED';

          // Update refund request status
          const updateRequestQuery = 'UPDATE refund_requests SET status = ?, processed_at = NOW() WHERE id = ?';
          connection.query(updateRequestQuery, [newStatus, requestId], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error updating refund request:', err);
                res.status(500).send({ message: 'Database error' });
              });
            }

            if (action === 'approve') {
              // Calculate refund amount (price - 3%)
              const refundAmount = refundRequest.price * 0.97;

              // Update user balance
              const updateBalanceQuery = 'UPDATE users SET balance = balance + ? WHERE username = ?';
              connection.query(updateBalanceQuery, [refundAmount, refundRequest.username], (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error('Error updating user balance:', err);
                    res.status(500).send({ message: 'Database error' });
                  });
                }

                // Send email notification to user
                const mailOptions = {
                  from: 'vclubunitedshop@gmail.com',
                  to: 'vclubunitedshop@gmail.com', // This would be user's email in production
                  subject: 'Refund Request Approved',
                  text: `Your refund request has been approved!
                  
Order ID: ${refundRequest.order_id}
Refund Amount: $${refundAmount.toFixed(2)} (original price: $${refundRequest.price} - 3% fee)
Status: REFUNDED

The refund amount has been added to your account balance.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error('Error sending email:', error);
                  } else {
                    console.log('Refund approval email sent:', info.response);
                  }
                });

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error('Commit error:', err);
                      res.status(500).send({ message: 'Transaction failed' });
                    });
                  }

                  connection.release();
                  res.status(200).send({ 
                    message: `Refund approved. User balance increased by $${refundAmount.toFixed(2)}.` 
                  });
                });
              });
            } else {
              // Reject refund request
              const mailOptions = {
                from: 'vclubunitedshop@gmail.com',
                to: 'vclubunitedshop@gmail.com', // This would be user's email in production
                subject: 'Refund Request Rejected',
                text: `Your refund request has been rejected.
                
Order ID: ${refundRequest.order_id}
Status: REJECTED

Please contact support if you have any questions.`
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error sending email:', error);
                } else {
                  console.log('Refund rejection email sent:', info.response);
                }
              });

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error('Commit error:', err);
                    res.status(500).send({ message: 'Transaction failed' });
                  });
                }

                connection.release();
                res.status(200).send({ message: 'Refund request rejected.' });
              });
            }
          });
        });
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          console.error('Transaction error:', error);
          res.status(500).send({ message: 'Transaction failed' });
        });
      }
    });
  });
});

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
module.exports = app;




