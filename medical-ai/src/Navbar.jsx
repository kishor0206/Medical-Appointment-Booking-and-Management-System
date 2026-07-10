import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const activeStyle = {
    backgroundColor: "#3b82f6",
    borderRadius: "6px",
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      <h2>🏥 Medical AI</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "10px",
            ...(location.pathname === "/" ? activeStyle : {}),
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/patients"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "10px",
            ...(location.pathname === "/patients"
              ? activeStyle
              : {}),
          }}
        >
          Patients
        </Link>

        <Link
          to="/doctors"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "10px",
            ...(location.pathname === "/doctors"
              ? activeStyle
              : {}),
          }}
        >
          Doctors
        </Link>
        <Link
         to="/ai-diagnosis"
         style={{
         color: "white",
         textDecoration: "none",
         padding: "10px",
         backgroundColor: "#12213a",
         borderRadius: "5px",
         }}
       >
         🤖 AI Diagnosis
       </Link>
        <Link
          to="/appointments"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "10px",
            ...(location.pathname === "/appointments"
              ? activeStyle
              : {}),
          }}
        >
          Appointments
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;