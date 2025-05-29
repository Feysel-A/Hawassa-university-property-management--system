const db = require("../config/database");
exports.getSummaryReport = async (req, res) => {
  try {
    // 1. Get all assets for total stock-in cost
    const [assets] = await db.query("SELECT quantity, cost FROM Assets");

    // 2. Join Requests with Assets to get cost of each requested item
    const [requests] = await db.query(`
      SELECT r.status, r.quantity, a.cost
      FROM Requests r
      JOIN Assets a ON r.asset_id = a.id
    `);

    const totalAssets = assets.length;
    const totalApprovedRequests = requests.filter((r) =>
      ["DeptApproved", "ManagerApproved", "Allocated"].includes(r.status)
    ).length;
    const totalPendingRequests = requests.filter(
      (r) => r.status === "Pending"
    ).length;

    const stockInCost = assets.reduce((sum, a) => sum + a.quantity * a.cost, 0);

    const stockOutCost = requests
      .filter((r) => r.status === "Accepted")
      .reduce((sum, r) => sum + r.quantity * r.cost, 0);

    res.json({
      totalAssets,
      totalApprovedRequests,
      totalPendingRequests,
      stockInCost,
      stockOutCost,
    });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

// controllers/reportController.js

exports.getMonthlyChartData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(request_date, '%Y-%m') AS month,
        COUNT(*) AS total_requests
      FROM Requests
      GROUP BY month
      ORDER BY month ASC
    `);

    const labels = rows.map((r) => r.month);
    const values = rows.map((r) => r.total_requests);

    res.json({ labels, values });
  } catch (error) {
    console.error("Chart data error:", error);
    res.status(500).json({ error: "Failed to load chart data" });
  }
};
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

