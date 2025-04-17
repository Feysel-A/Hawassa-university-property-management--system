const db = require("../config/database");

// GET all assets
exports.getAllAssets = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        a.id, a.name, a.model_name, a.code, a.type, a.quantity, 
        a.cost, a.status, a.disposition, d.department_name, a.created_at
      FROM Assets a
      LEFT JOIN Departments d ON a.department_id = d.department_id
      ORDER BY a.created_at DESC
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assets", details: err });
  }
};

// POST new asset
exports.registerAsset = async (req, res) => {
  const { name, model_name, code, type, quantity, cost, department_id } = req.body;

  if (!name || !model_name || !code || !type || !quantity || !cost || !department_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.query(
      `INSERT INTO Assets 
        (name, model_name, code, type, quantity, cost, department_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, model_name, code, type, quantity, cost, department_id]
    );
    res.status(201).json({ message: "Asset registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add asset", details: err });
  }
};

// PUT update asset
exports.updateAsset = async (req, res) => {
  const { id } = req.params;
  const { name, model_name, code, type, quantity, cost, status, department_id } = req.body;

  try {
    await db.query(
      `UPDATE Assets 
       SET name = ?, model_name = ?, code = ?, type = ?, quantity = ?, 
           cost = ?, status = ?, department_id = ?
       WHERE id = ?`,
      [name, model_name, code, type, quantity, cost, status, department_id, id]
    );
    res.json({ message: "Asset updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update asset", details: err });
  }
};

// DELETE (soft delete) asset
exports.deleteAsset = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE Assets SET status = 'Removed' WHERE id = ?",
      [id]
    );
    res.json({ message: "Asset marked as removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove asset", details: err });
  }
};
