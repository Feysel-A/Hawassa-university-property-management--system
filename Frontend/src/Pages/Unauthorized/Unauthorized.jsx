const Unauthorized = () => (
  <div className="text-center py-3">
    <h2 style={{ color: "red", fontSize: "2rem", fontWeight: "bold" }}>
      403 – Unauthorized
    </h2>
    <p>You do not have permission to view this page.</p>
    <p>
      <a href="/login">Go to Login</a>
    </p>
  </div>
);

export default Unauthorized;
