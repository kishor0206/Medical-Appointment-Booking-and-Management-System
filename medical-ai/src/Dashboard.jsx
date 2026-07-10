import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function Dashboard() {
  const [data, setData] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(`${API}/dashboard`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏥 Medical Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* Patients Card */}
        <Link
          to="/patients"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <div className="card">
            <h2>Patients</h2>
            <h1>{data.total_patients}</h1>
          </div>
        </Link>

        {/* Doctors Card */}
        <Link
          to="/doctors"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <div className="card">
            <h2>Doctors</h2>
            <h1>{data.total_doctors}</h1>
          </div>
        </Link>

        {/* Appointments Card */}
        <Link
          to="/appointments"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          <div className="card">
            <h2>Appointments</h2>
            <h1>{data.total_appointments}</h1>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;