const db = require("../config/database");

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Announcements ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

// Post a new announcement
exports.createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  try {
    await db.query("INSERT INTO Announcements (title, message) VALUES (?, ?)", [
      title,
      message,
    ]);
    res.json({ message: "Announcement created successfully" });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

// Delete
exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM Announcements WHERE id = ?", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// Update
exports.updateAnnouncement = async (req, res) => {
  const id = req.params.id;
  const { title, message } = req.body;
  try {
    await db.query(
      "UPDATE Announcements SET title = ?, message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [title, message, id]
    );
    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};
