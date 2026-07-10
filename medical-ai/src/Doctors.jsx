import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://127.0.0.1:8000";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
  });

  const loadDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctors`);
      setDoctors(res.data);
    } catch (error) {
      console.error("Error loading doctors:", error);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const createDoctor = async () => {
    if (!form.name || !form.specialization) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${API}/doctors`, form);

      setForm({
        name: "",
        specialization: "",
      });

      loadDoctors();
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`${API}/doctors/${id}`);
      loadDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctors Management</h1>

      <h2>Add Doctor</h2>

      <input
        type="text"
        placeholder="Doctor Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Specialization"
        value={form.specialization}
        onChange={(e) =>
          setForm({
            ...form,
            specialization: e.target.value,
          })
        }
      />

      <br />
      <br />

      <button onClick={createDoctor}>
        Add Doctor
      </button>

      <hr />

      <h2>Doctors List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
  {doctors.map((doctor) => (
    <tr key={doctor.id}>
      <td>{doctor.id}</td>

      <td>
        <Link
          to={`/doctors/${doctor.id}`}
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          {doctor.name}
        </Link>
      </td>

      <td>{doctor.specialization}</td>

      <td>
        <button
          onClick={() => deleteDoctor(doctor.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default Doctors;