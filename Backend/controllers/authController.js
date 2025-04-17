const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Register a new user
exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    role,
    department_id,
    phone,
    address,
    password,
  } = req.body;

  try {
    // Check if email exists
    const [existingUser] = await db.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ error: "Email already exists. Please use a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [userResult] = await db.query(
      `INSERT INTO Users (first_name, last_name, role, department_id, phone, address, email, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        first_name,
        last_name,
        role,
        department_id || null,
        phone,
        address,
        email,
      ]
    );

    const user_id = userResult.insertId;

    // Insert account credentials
    await db.query(
      `INSERT INTO Accounts (user_id, username, password)
       VALUES (?, ?, ?)`,
      [user_id, email, hashedPassword]
    );

    // 🔁 If DepartmentHead, update Departments table
    if (role === "DepartmentHead") {
      await db.query(
        `UPDATE Departments SET department_head_id = ? WHERE department_id = ?`,
        [user_id, department_id]
      );
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};
// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Check if account exists
    const [accounts] = await db.query(
      "SELECT * FROM Accounts WHERE username = ?",
      [username]
    );

    if (accounts.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const account = accounts[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Get the user details (e.g., role) from Users table
    const [users] = await db.query(
      "SELECT id, first_name, last_name, role, email FROM Users WHERE id = ?",
      [account.user_id]
    );
    const user = users[0];

    // Generate token
    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};
