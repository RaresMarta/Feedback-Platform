export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f8f8"
    }}>
      <h1 style={{ fontSize: "4rem", margin: 0, color: "#d32f2f" }}>404</h1>
      <h2 style={{ margin: "1rem 0 0.5rem 0" }}>Page Not Found</h2>
      <p style={{ color: "#555" }}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
