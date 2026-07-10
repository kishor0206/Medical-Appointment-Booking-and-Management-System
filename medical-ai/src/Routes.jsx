import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import AIDiagnosis from "./AIDiagnosis";
import PatientDetails from "./PatientDetails";
import DoctorDetails from "./DoctorDetails";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/ai-diagnosis"element={<AIDiagnosis />}/>
        <Route path="/patients/:id"element={<PatientDetails />}/>
        <Route path="/doctors/:id"element={<DoctorDetails />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;