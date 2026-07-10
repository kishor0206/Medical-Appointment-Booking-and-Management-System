import { useEffect, useState } from "react";
import axios from "axios";
import "./Appointments.css";

const API = "http://127.0.0.1:8000";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
  });

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await axios.get(`${API}/appointments`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Appointments Error:", err);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await axios.get(`${API}/patients`);
      setPatients(res.data);
    } catch (err) {
      console.error("Patients Error:", err);
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Doctors Error:", err);
    }
  };

  const createAppointment = async () => {
    if (
      !form.patient_id ||
      !form.doctor_id ||
      !form.appointment_date
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
        await axios.post(`${API}/appointments`, {
            patient_id: Number(form.patient_id),
            doctor_id: Number(form.doctor_id),
            appointment_date: form.appointment_date,
            status: "Booked",
        
      });

      alert("Appointment booked successfully");

      setForm({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
      });

      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment");
    }
  };

  const deleteAppointment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/appointments/${id}`);
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await axios.put(
        `${API}/appointments/${id}/status?status=${status}`
      );
  
      loadAppointments();
    } catch (err) {
      console.error(err);
    }
  };
  const filteredAppointments = appointments.filter((a) => {
    const patientMatch =
      a.patient
        ?.toLowerCase()
        .includes(searchPatient.toLowerCase());
  
    const doctorMatch =
      a.doctor
        ?.toLowerCase()
        .includes(searchDoctor.toLowerCase());
  
    const statusMatch =
      statusFilter === ""
        ? true
        : a.status === statusFilter;
  
    const dateMatch =
      dateFilter === ""
        ? true
        : a.appointment_date
            ?.split("T")[0] === dateFilter;
  
    return (
      patientMatch &&
      doctorMatch &&
      statusMatch &&
      dateMatch
    );
  });
  return (
    <div className="appointments-page">
      <h1>📅 Appointment Management</h1>
  
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card">
          <h3>Total</h3>
          <p>{appointments.length}</p>
        </div>
  
        <div className="card">
          <h3>Booked</h3>
          <p>
            {appointments.filter((a) => a.status === "Booked").length}
          </p>
        </div>
  
        <div className="card">
          <h3>Completed</h3>
          <p>
            {appointments.filter((a) => a.status === "Completed").length}
          </p>
        </div>
  
        <div className="card">
          <h3>Cancelled</h3>
          <p>
            {appointments.filter((a) => a.status === "Cancelled").length}
          </p>
        </div>
      </div>
  
      {/* Appointment Form */}
      <div className="appointment-form">
        <h2>Book Appointment</h2>
  
        <select
          value={form.patient_id}
          onChange={(e) =>
            setForm({
              ...form,
              patient_id: e.target.value,
            })
          }
        >
          <option value="">Select Patient</option>
  
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
  
        <select
          value={form.doctor_id}
          onChange={(e) =>
            setForm({
              ...form,
              doctor_id: e.target.value,
            })
          }
        >
          <option value="">Select Doctor</option>
  
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.specialization})
            </option>
          ))}
        </select>
  
        <input
          type="datetime-local"
          value={form.appointment_date}
          onChange={(e) =>
            setForm({
              ...form,
              appointment_date: e.target.value,
            })
          }
        />
  
        <button
          className="btn btn-primary"
          onClick={createAppointment}
        >
          Book Appointment
        </button>
      </div>
  
      {/* Filters */}
      <h2>Search & Filter</h2>
  
      <div className="filters">
        <input
          type="text"
          placeholder="Search Patient"
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
        />
  
        <input
          type="text"
          placeholder="Search Doctor"
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
        />
  
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
  
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
  
        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearchPatient("");
            setSearchDoctor("");
            setStatusFilter("");
            setDateFilter("");
          }}
        >
          Clear Filters
        </button>
      </div>
  
      {/* Appointment Table */}
      <h2>Appointments List</h2>
  
      <div className="table-container">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Appointment Date</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
  
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
  
                  <td>{a.patient}</td>
  
                  <td>{a.doctor}</td>
  
                  <td>{a.appointment_date}</td>
  
                  <td>
                    <select
                      className="status-select"
                      value={a.status}
                      onChange={(e) =>
                        updateStatus(a.id, e.target.value)
                      }
                    >
                      <option value="Booked">
                        Booked
                      </option>
  
                      <option value="Completed">
                        Completed
                      </option>
  
                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>
  
                  <td>
                  <td>
  <div className="action-buttons">
    <button
      className="btn btn-danger"
      onClick={() => deleteAppointment(a.id)}
    >
      Delete
    </button>
  </div>
</td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="no-data"
                >
                  No Appointments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default Appointments;