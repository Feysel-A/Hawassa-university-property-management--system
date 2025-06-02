const db = require("../config/database");
// backend/controllers/admin.js
exports.getStatistics = async (req, res) => {
  try {
    const [[assetCount]] = await db.query(
      "SELECT COUNT(*) AS totalAssets FROM Assets"
    );
    const [[reqCount]] = await db.query(
      "SELECT COUNT(*) AS totalRequests FROM Requests"
    );
    const [[approved]] = await db.query(
      `SELECT COUNT(*) AS totalApproved FROM Requests WHERE status IN ('DeptApproved','ManagerApproved','Allocated','Accepted')`
    );
    const [[rejected]] = await db.query(
      `SELECT COUNT(*) AS totalRejected FROM Requests WHERE status IN ('DeptDenied','ManagerDenied','RejectedByUser')`
    );

    res.json({
      totalAssets: assetCount.totalAssets,
      totalRequests: reqCount.totalRequests,
      totalApproved: approved.totalApproved,
      totalRejected: rejected.totalRejected,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load statistics" });
  }
};

exports.getDetailsByType = async (req, res) => {
  const { type } = req.params;
  let query = "";
  try {
    if (type === "assets") {
      query = `SELECT id, name, code, quantity, cost, type, status FROM Assets`;
    } else if (type === "requests") {
      query = `
        SELECT r.id, CONCAT(u.first_name, ' ', u.last_name) AS requested_by,
               a.name AS asset_name, r.status, r.quantity
        FROM Requests r
        JOIN Users u ON r.employee_id = u.id
        JOIN Assets a ON r.asset_id = a.id
      `;
    } else if (type === "approved") {
      query = `
        SELECT r.id, CONCAT(u.first_name, ' ', u.last_name) AS requested_by,
               a.name AS asset_name, r.status, r.quantity
        FROM Requests r
        JOIN Users u ON r.employee_id = u.id
        JOIN Assets a ON r.asset_id = a.id
        WHERE r.status IN ('DeptApproved','ManagerApproved','Allocated','Accepted')
      `;
    } else if (type === "rejected") {
      query = `
        SELECT r.id, CONCAT(u.first_name, ' ', u.last_name) AS requested_by,
               a.name AS asset_name, r.status, r.quantity
        FROM Requests r
        JOIN Users u ON r.employee_id = u.id
        JOIN Assets a ON r.asset_id = a.id
        WHERE r.status IN ('DeptDenied','ManagerDenied','RejectedByUser')
      `;
    }

    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching detail records:", err);
    res.status(500).json({ error: "Failed to fetch detail records." });
  }
};

exports.getEnhancedReport = async (req, res) => {
  try {
    const [assets] = await db.query("SELECT quantity, cost FROM Assets");
    const [requests] = await db.query(
      `SELECT r.quantity, a.cost, r.status
       FROM Requests r
       JOIN Assets a ON r.asset_id = a.id`
    );

    const totalAssets = assets.length;
    const totalStockInCost = assets.reduce(
      (sum, a) => sum + a.quantity * a.cost,
      0
    );
    const totalApproved = requests.filter((r) =>
      ["DeptApproved", "ManagerApproved", "Allocated", "Accepted"].includes(
        r.status
      )
    ).length;
    const totalPending = requests.filter((r) => r.status === "Pending").length;

    const totalStockOutCost = requests
      .filter((r) => r.status === "Allocated")
      .reduce((sum, r) => sum + r.quantity * r.cost, 0);

    // Stock balance = in - out
    const balance = totalStockInCost - totalStockOutCost;

    res.json({
      totalAssets,
      totalApproved,
      totalPending,
      totalStockInCost,
      totalStockOutCost,
      balance,
    });
  } catch (err) {
    console.error("Enhanced Report Error:", err);
    res.status(500).json({ error: "Failed to load enhanced report" });
  }
};
