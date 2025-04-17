import React, { useState } from "react";

const Announcements = () => {
  const [visible, setVisible] = useState(true);
  
  const announcements = [
    "New office chairs added to inventory!",
    "Laptops are now available for department allocation.",
    "Reminder: Return unused assets before the semester ends."
  ];

  if (!visible) return null; // Do not render if not visible

  return (
    <div
      style={{
        width: "80%",
        backgroundColor: "rgba(5, 22, 66, 0.7)",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px auto",
        position: "relative",
        color: "white",
        fontSize: "1.2em"
      }}
    >
      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "1.5em",
          cursor: "pointer"
        }}
      >
        &times;
      </button>
      <h2>Latest Announcements</h2>
      <ul>
        {announcements.map((announcement, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {announcement}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
