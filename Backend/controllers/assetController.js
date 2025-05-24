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
  const { name, model_name, code, type, quantity, cost, department_id } =
    req.body;

  if (
    !name ||
    !model_name ||
    !code ||
    !type ||
    !quantity ||
    !cost ||
    !department_id
  ) {
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
exports.disposeAsset = async (req, res) => {
  const { id } = req.params;
  const {
    replacement_type,         // 'Replaced', 'Donated', 'Removed'
    replacement_reason,       // explanation
    new_asset_id,             // optional
    institution_name          // optional (for 'Donated')
  } = req.body;

  try {
    // 1. Update asset status
    await db.query(

      `UPDATE Assets SET status = ? WHERE id = ?`,
      [replacement_type, id]
    );

    // 2. Insert disposal record
    await db.query(
      `INSERT INTO Asset_Disposals (asset_id, replacement_type, replacement_reason, new_asset_id, institution_name)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        replacement_type,
        replacement_reason || null,
        new_asset_id || null,
        institution_name || null
      ]
    );
    res.status(200).json({ message: "Asset disposed successfully." });
  } catch (error) {
    console.error("Disposal error:", error);
    res.status(500).json({ error: "Disposal failed", details: error.message });
  }
};
