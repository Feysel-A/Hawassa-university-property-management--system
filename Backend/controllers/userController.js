const db = require("../config/database");

// ✅ GET All Users with Department Name
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, 
        u.email, u.role, d.department_name AS department, u.created_at
      FROM Users u
      LEFT JOIN Departments d ON u.department_id = d.department_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
};

// ✅ UPDATE User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const [first_name, last_name] = name.split(" ");
    const [result] = await db.query(
      `UPDATE Users SET first_name = ?, last_name = ?, email = ? WHERE id = ?`,
      [first_name, last_name, email, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err });
  }
};

// ✅ DELETE User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM Users WHERE id = ?`, [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err });
  }
};
