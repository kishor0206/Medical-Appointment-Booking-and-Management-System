import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [prediction, setPrediction] = useState("");
  const [recommendedDoctor, setRecommendedDoctor] =
    useState(null);
  const [risk, setRisk] = useState("");

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const res = await axios.get(
        `${API}/patients/${id}`
      );

      setPatient(res.data);

      const appRes = await axios.get(
        `${API}/patients/${id}/appointments`
      );

      setAppointments(appRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // AI DIAGNOSIS
  // ==========================
  const getDiagnosis = async () => {
    try {
      const res = await axios.post(
        `${API}/ai-diagnosis`,
        {
          symptoms: patient.symptoms,
        }
      );

      setPrediction(res.data.prediction);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // DOCTOR RECOMMENDATION
  // ==========================
  const getDoctorRecommendation =
    async () => {
      try {
        const res = await axios.post(
          `${API}/recommend-doctor`,
          {
            symptoms: patient.symptoms,
          }
        );

        setRecommendedDoctor(res.data);
      } catch (err) {
        console.error(err);
      }
    };

  // ==========================
  // RISK ANALYSIS
  // ==========================
  const analyzeRisk = () => {
    const symptoms =
      patient.symptoms?.toLowerCase() || "";

    if (
      symptoms.includes("chest pain") ||
      symptoms.includes("heart")
    ) {
      setRisk("🔴 High Risk");
    } else if (
      symptoms.includes("fever") ||
      symptoms.includes("cough")
    ) {
      setRisk("🟠 Medium Risk");
    } else {
      setRisk("🟢 Low Risk");
    }
  };

  // ==========================
  // MEDICAL SUMMARY
  // ==========================
  const generateSummary = () => {
    alert(`
Patient: ${patient.name}

Age: ${patient.age}

Gender: ${patient.gender}

Symptoms: ${patient.symptoms}

Diagnosis: ${patient.diagnosis}
    `);
  };

  if (!patient) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>👤 Patient Profile</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "900px",
        }}
      >
        <h2>{patient.name}</h2>

        <p>
          <strong>Age:</strong> {patient.age}
        </p>

        <p>
          <strong>Gender:</strong> {patient.gender}
        </p>

        <p>
          <strong>Phone:</strong> {patient.phone}
        </p>

        <p>
          <strong>Email:</strong> {patient.email}
        </p>

        <p>
          <strong>Blood Group:</strong>{" "}
          {patient.blood_group}
        </p>

        <p>
          <strong>Symptoms:</strong>{" "}
          {patient.symptoms}
        </p>

        <p>
          <strong>Diagnosis:</strong>{" "}
          {patient.diagnosis}
        </p>

        <hr />

        <h2>🤖 AI Assistant</h2>

        <button onClick={getDiagnosis}>
          AI Diagnosis
        </button>

        <button
          onClick={getDoctorRecommendation}
          style={{ marginLeft: "10px" }}
        >
          Recommend Doctor
        </button>

        <button
          onClick={analyzeRisk}
          style={{ marginLeft: "10px" }}
        >
          Risk Analysis
        </button>

        <button
          onClick={generateSummary}
          style={{ marginLeft: "10px" }}
        >
          Medical Summary
        </button>

        {/* AI Diagnosis Result */}
        {prediction && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#e0f2fe",
              borderRadius: "8px",
            }}
          >
            <h3>AI Diagnosis</h3>

            <p>{prediction}</p>
          </div>
        )}

        {/* Doctor Recommendation */}
        {recommendedDoctor && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#dcfce7",
              borderRadius: "8px",
            }}
          >
            <h3>
              Recommended Doctor
            </h3>

            <p>
              <strong>Doctor:</strong>{" "}
              {
                recommendedDoctor.recommended_doctor
              }
            </p>

            <p>
              <strong>
                Specialization:
              </strong>{" "}
              {
                recommendedDoctor.specialization
              }
            </p>

            <p>
              <strong>
                Confidence:
              </strong>{" "}
              {
                recommendedDoctor.confidence
              }
            </p>
          </div>
        )}

        {/* Risk Analysis */}
        {risk && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fee2e2",
              borderRadius: "8px",
            }}
          >
            <h3>Risk Analysis</h3>

            <p>{risk}</p>
          </div>
        )}

        <hr />

        <h2>
          📅 Appointment History
        </h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.doctor}</td>
                  <td>
                    {a.appointment_date}
                  </td>
                  <td>{a.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientDetails;