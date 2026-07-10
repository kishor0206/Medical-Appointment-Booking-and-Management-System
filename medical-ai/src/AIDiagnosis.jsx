import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

function AIDiagnosis() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");

  const analyzeSymptoms = async () => {
    try {
      const res = await axios.post(
        `${API}/ai-diagnosis`,
        {
          symptoms: symptoms,
        }
      );

      setResult(res.data.prediction);
    } catch (err) {
      console.error(err);
      alert("Error analyzing symptoms");
    }
  };

  return (
    <div className="ai-container">
      <h1>🤖 AI Symptom Analysis</h1>

      <textarea
        className="ai-textarea"
        rows="5"
        placeholder="Enter symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <br />
      <br />

      <button
        className="ai-button"
        onClick={analyzeSymptoms}
      >
        Analyze Symptoms
      </button>

      {result && (
        <div className="ai-result">
          <h3>Prediction</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default AIDiagnosis;