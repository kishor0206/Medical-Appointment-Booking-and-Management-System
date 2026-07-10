import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    phone: "",
    email: "",
    address: "",
    blood_group: "",
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
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.phone
    ) {
      alert("Please fill all required fields");
      return;
    }
  
    try {
      await axios.post(`${API}/patients`, {
        ...form,
        age: Number(form.age),
      });
  
      alert("Patient Added Successfully");
  
      resetForm();
      loadPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePatient = async () => {
    try {
      await axios.put(
        `${API}/patients/${editingId}`,
        {
          ...form,
          age: Number(form.age),
        }
      );

      resetForm();
      loadPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePatient = async (id) => {
    
    try {
      await axios.delete(`${API}/patients/${id}`);
      loadPatients();
    } catch (err) {
      console.error(err);
    }
  };
  const getRecommendation = async (symptoms) => {
    console.log(symptoms);
    try {
      const res = await axios.post(
        `${API}/recommend-doctor`,
        {
          symptoms: symptoms,
        }
      );
  
      alert(
        `Recommended Doctor:
  ${res.data.recommended_doctor}
  
  Specialization:
  ${res.data.specialization}
  
  Confidence:
  ${res.data.confidence}`
      );
    } 
    catch (err) {
        console.log("ERROR:", err.response.data);
        alert(JSON.stringify(err.response.data));
      }
  };

  const editPatient = (patient) => {
    setEditingId(patient.id);
  
    setForm({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      blood_group: patient.blood_group || "",
      symptoms: patient.symptoms || "",
      diagnosis: patient.diagnosis || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
  
    setForm({
      name: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      blood_group: "",
      symptoms: "",
      diagnosis: "",
    });
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="container">
      <h1>🏥 Medical AI Dashboard</h1>

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

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
         <option value="">Select Gender</option>
         <option value="Male">Male</option>
         <option value="Female">Female</option>
         <option value="Other">Other</option>
        </select>
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <select
         name="blood_group"
        value={form.blood_group}
         onChange={handleChange}  
        >
        <option value="">Select Blood Group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        </select>

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
  onClick={() => {
    if (!form.symptoms) {
      alert("No symptoms available");
      return;
    }

    getRecommendation(form.symptoms);
  }}
>
  Recommend Doctor
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

      <div className="table-container">
  <table className="patient-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Blood Group</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredPatients.length > 0 ? (
        filteredPatients.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>

            <td className="patient-name">
              {p.name}
            </td>

            <td>{p.age}</td>

            <td>{p.gender}</td>

            <td>{p.phone}</td>

            <td>{p.email}</td>

            <td className="blood-group">
              {p.blood_group}
            </td>

            <td>
              <div className="actions">
                <button
                  className="btn-edit"
                  onClick={() => editPatient(p)}
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => deletePatient(p.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="no-data">
            No Patients Found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default App;