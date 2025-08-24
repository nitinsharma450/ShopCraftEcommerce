export default function CenterSpinner() {
  const spinnerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9fafb", // Light gray
  };

  const spinnerStyle = {
    width: "80px",
    height: "80px",
    border: "8px solid rgba(0, 0, 0, 0.1)",
    borderTop: "8px solid #6366f1", // Indigo (like Flipkart or Meesho themes)
    borderRadius: "50%",
    animation: "professional-spin 0.9s linear infinite",
    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)", // Indigo glow
  };

  return (
    <>
      <div style={spinnerContainerStyle}>
        <div style={spinnerStyle}></div>
      </div>
      <style>
        {`
          @keyframes professional-spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}
