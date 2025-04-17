const { request } = require("express");
const db = require("../config/database");

exports.createRequest = async (req, res) => {
  const { employee_id, asset_id, quantity, purpose } = req.body;
  if (!employee_id || !asset_id || !quantity || !purpose) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    await db.query(
      "INSERT INTO Requests (employee_id, asset_id, quantity, purpose) VALUES (?, ?, ?, ?)",
      [employee_id, asset_id, quantity, purpose]
    );
    res.json({ message: "Request created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create request", details: error });
  }
};
exports.createUnfulfilledRequest = async (req, res) => {
  const { employee_id, name, type, quantity, purpose } = req.body;
  if (!employee_id || !name || !type || !quantity || !purpose) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    await db.query(
      "INSERT INTO unfulfilled_requests (employee_id, asset_name, asset_type, quantity, purpose) VALUES (?, ?, ?, ?, ?)",
      [employee_id, name, type, quantity, purpose]
    );
    res.json({ message: "Request created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create request", details: error });
  }
};
exports.cancelRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `DELETE FROM Requests WHERE id = ? AND status NOT IN ('Allocated', 'Accepted', 'Rejected')`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Request cannot be canceled or not found." });
    }

    res.json({ message: "Request canceled successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Cancel request failed.", details: error.message });
  }
};

exports.approveByDeptHead = async (req, res) => {
  const { id } = req.params;
  const { status, approved_by } = req.body; // status: "Approved" or "Denied"
  try {
    // Step 1: Get the request details
    const [requestResult] = await db.query(
      `SELECT * FROM Requests WHERE id = ?`,
      [id]
    );

    if (requestResult.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = requestResult[0];

    // Step 2: Only approve if request is still pending
    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request already handled" });
    }

    // Step 3: Update the request
    const updateQuery = `
      UPDATE Requests 
      SET status = ?, dept_head_id = ?, dept_action_date = NOW()
      WHERE id = ?
    `;

    await db.query(updateQuery, [status, approved_by, id]);

    return res.json({ message: `Request ${status} by Department Head` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Approval failed", details: error.message });
  }
};

exports.allocateByManager = async (req, res) => {
  const { id } = req.params;
  const { status, manager_id } = req.body; // status = 'ManagerApproved' or 'ManagerDenied'

  // Validate input
  if (!["ManagerApproved", "ManagerDenied"].includes(status)) {
    return res.status(400).json({ error: "Invalid status provided." });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE Requests 
      SET 
        status = ?, 
        manager_id = ?, 
        manager_action_date = NOW()
      WHERE id = ?
      `,
      [status, manager_id, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Request not found or already processed." });
    }

    res.json({
      message: `Request successfully ${
        status === "ManagerApproved" ? "approved" : "denied"
      } by manager.`,
    });
  } catch (error) {
    console.error("Manager decision error:", error);
    res.status(500).json({
      error: "Failed to update request status",
      details: error.message,
    });
  }
};

exports.confirmByStoreman = async (req, res) => {
  const { id } = req.params;
  const { storekeeper_id } = req.body;

  try {
    const [result] = await db.query(
      `
      UPDATE Requests
      SET 
        status = 'Allocated',
        storekeeper_id = ?,
        allocation_date = NOW()
      WHERE id = ? AND status = 'ManagerApproved'
      `,
      [storekeeper_id, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Request not found or already confirmed." });
    }

    res.status(200).json({
      message: "✅ Request confirmed and asset issued by Storekeeper.",
    });
  } catch (error) {
    console.error("Storekeeper confirmation error:", error);
    res
      .status(500)
      .json({ error: "Failed to confirm request", details: error.message });
  }
};
// controllers/requestController.js
// PUT /api/requests/confirm/:id
exports.confirmAssetReceived = async (req, res) => {
  const { id } = req.params;
  const { accepted } = req.body;

  const newStatus = accepted ? "Accepted" : "RejectedByUser";
  try {
    const [result] = await db.query(
      `
      UPDATE Requests
      SET status = ?, user_confirmation_date = NOW()
      WHERE id = ? AND status = 'Allocated'
      `,
      [newStatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No eligible request found." });
    }

    res.json({
      message: `✅ Request ${newStatus.toLowerCase()} successfully.`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to confirm request", details: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT r.*, a.name as asset_name, u.first_name, u.last_name
      FROM Requests r
      JOIN Assets a ON r.asset_id = a.id
      JOIN Users u ON r.employee_id = u.id
    `
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests", details: error });
  }
};

// Get ALL requests (fulfilled + unfulfilled) for a specific user

exports.getUserRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const [requests] = await db.query(
      `
      SELECT 
        r.id,
        a.name AS asset_name,
        a.type AS asset_type,
        r.quantity,
        r.purpose,
        r.status,
        r.request_date,
        r.dept_action_date AS approval_date,
        'Available Asset' AS source
      FROM Requests r
      JOIN Assets a ON r.asset_id = a.id
      WHERE r.employee_id = ?

      UNION

      SELECT 
        ur.id,
        ur.asset_name,
        ur.asset_type,
        ur.quantity,
        ur.purpose,
        ur.status,
        ur.request_date,
        NULL AS approval_date,
        'Unfulfilled Request' AS source
      FROM Unfulfilled_Requests ur
      WHERE ur.employee_id = ?

      ORDER BY request_date DESC
      `,
      [id, id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: "No requests found for the user." });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch requests", details: error.message });
  }
};

// Get ALL requests (fulfilled + unfulfilled) for department head
// Get requests made by staff in the department of this department head
exports.getRequestsForDepartmentHead = async (req, res) => {
  const departmentHeadId = req.params.id;
  try {
    // 1. Find department_id of the department head
    const [deptRows] = await db.query(
      "SELECT department_id FROM Users WHERE id = ? AND role = 'DepartmentHead'",
      [departmentHeadId]
    );

    if (deptRows.length === 0) {
      return res.status(404).json({ error: "Department Head not found" });
    }

    const departmentId = deptRows[0].department_id;

    // 2. Fetch pending requests made by staff in that department
    const [requests] = await db.query(
      `
      SELECT 
        r.id, r.employee_id, CONCAT(u.first_name, ' ', u.last_name) AS staff_name,
        a.name AS asset_name, a.type AS asset_type, r.quantity, r.purpose, r.status, r.request_date
      FROM Requests r
      JOIN Users u ON r.employee_id = u.id
      JOIN Assets a ON r.asset_id = a.id
      WHERE u.department_id = ?
        AND u.role = 'Staff' OR u.role = 'departmentHead'
        AND r.status = 'Pending'
      ORDER BY r.request_date DESC
      `,
      [departmentId]
    );

    res.json(requests);
  } catch (error) {
    console.error("Error fetching department requests:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch department requests", details: error });
  }
};

// Get ALL requests (fulfilled + unfulfilled) for role manager
exports.getRequestsForManager = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT 
        r.id, r.employee_id, r.asset_id, r.quantity, r.status, r.request_date,
        a.name AS asset_name, a.type AS asset_type,
        CONCAT(u.first_name, ' ', u.last_name) AS requested_by
      FROM Requests r
      JOIN Assets a ON r.asset_id = a.id
      JOIN Users u ON r.employee_id = u.id
      WHERE r.status = 'DeptApproved'
      ORDER BY r.request_date DESC
      `
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch manager requests",
      details: error.message,
    });
  }
};

//Get All requests (fulfilled + unfulfilled) for role StoreKeeper
exports.getRequestsForStoreman = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT 
        r.id,
        CONCAT(u.first_name, ' ', u.last_name) AS requested_by,
        a.name AS asset_name,
        a.type AS asset_type,
        r.quantity,
        r.request_date
      FROM Requests r
      JOIN Users u ON r.employee_id = u.id
      JOIN Assets a ON r.asset_id = a.id
      WHERE r.status = 'ManagerApproved'
      ORDER BY r.request_date DESC
      `
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching storeman requests:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch requests", details: err.message });
  }
};
// ✅ Get all requests that are accepted or rejected by users after storeman allocation
exports.getHandledRequestsByStoreman = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT 
        r.id,
        CONCAT(u.first_name, ' ', u.last_name) AS staff_name,
        a.name AS asset_name,
        a.type AS asset_type,
        r.quantity,
        r.status,
        r.request_date,
        r.allocation_date
      FROM Requests r
      JOIN Users u ON r.employee_id = u.id
      JOIN Assets a ON r.asset_id = a.id
      WHERE r.status = 'Accepted' OR r.status = 'RejectedByUser'
      ORDER BY r.allocation_date DESC
      `
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching handled requests:", error);
    res.status(500).json({
      error: "Failed to fetch handled requests",
      details: error.message,
    });
  }
};
