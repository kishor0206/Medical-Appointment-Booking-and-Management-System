import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function DoctorDetails() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadDoctor();
  }, []);

  const loadDoctor = async () => {
    try {
      const res = await axios.get(
        `${API}/doctors/${id}/details`
      );

      setDoctor(res.data.doctor);
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    }
  };

  if (!doctor) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>👨‍⚕️ Doctor Profile</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>{doctor.name}</h2>

        <p>
          <strong>Specialization:</strong>{" "}
          {doctor.specialization}
        </p>

        <p>
          <strong>Total Appointments:</strong>{" "}
          {appointments.length}
        </p>
      </div>

      <h2>Appointment History</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.patient}</td>
              <td>{a.appointment_date}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorDetails;