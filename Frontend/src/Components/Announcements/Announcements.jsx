import { useEffect, useState } from "react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/announcements");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        setError("Failed to load announcements.");
      }
    };

    fetchAnnouncements();
  }, []);

  if (!visible || announcements.length === 0) return null;

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
        fontSize: "1.1em",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "15px",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "1.5em",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
      <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>
        📢 Announcements
      </h2>
      <hr style={{ borderColor: "white", marginBottom: "15px" }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
        {announcements.map((a) => (
          <li key={a.id} style={{ marginBottom: "15px" }}>
            <strong>{a.title}</strong> <br />
            <span>{a.message}</span> <br />
            <small style={{ fontSize: "0.8em", color: "#ccc" }}>
              {new Date(a.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
