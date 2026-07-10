import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    diagnosis: "",
  });

  const loadPatients = async () => {
    try {
      const res = await axios.get(`${API}/patients`);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createPatient = async () => {
    await axios.post(`${API}/patients`, {
      ...form,
      age: Number(form.age),
    });

    resetForm();
    loadPatients();
  };

  const updatePatient = async () => {
    await axios.put(
      `${API}/patients/${editingId}`,
      {
        ...form,
        age: Number(form.age),
      }
    );

    resetForm();
    loadPatients();
  };

  const deletePatient = async (id) => {
    await axios.delete(`${API}/patients/${id}`);
    loadPatients();
  };

  const editPatient = (patient) => {
    setEditingId(patient.id);

    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      symptoms: patient.symptoms,
      diagnosis: patient.diagnosis,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      age: "",
      gender: "",
      symptoms: "",
      diagnosis: "",
    });
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h1>🏥 Medical AI Appointment System</h1>

      <div className="navbar">
        <Link to="/">Patients</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/appointments">Appointments</Link>
      </div>

      <div className="stats">
        <div className="card">
          <h3>Total Patients</h3>
          <p>{patients.length}</p>
        </div>

        <div className="card">
          <h3>Males</h3>
          <p>
            {
              patients.filter(
                (p) =>
                  p.gender.toLowerCase() === "male"
              ).length
            }
          </p>
        </div>

        <div className="card">
          <h3>Females</h3>
          <p>
            {
              patients.filter(
                (p) =>
                  p.gender.toLowerCase() === "female"
              ).length
            }
          </p>
        </div>
      </div>

      <div className="form-section">
        <h2>
          {editingId
            ? "Update Patient"
            : "Add Patient"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <input
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={handleChange}
        />

        <input
          name="symptoms"
          placeholder="Symptoms"
          value={form.symptoms}
          onChange={handleChange}
        />

        <input
          name="diagnosis"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
        />

        {editingId ? (
          <>
            <button onClick={updatePatient}>
              Update Patient
            </button>

            <button
              className="cancel"
              onClick={resetForm}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={createPatient}>
            Add Patient
          </button>
        )}
      </div>

      <div className="search-box">
        <input
          placeholder="Search Patient..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Symptoms</th>
            <th>Diagnosis</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.symptoms}</td>
              <td>{p.diagnosis}</td>

              <td>
                <button onClick={() => editPatient(p)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() =>
                    deletePatient(p.id)
                  }
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

export default App;