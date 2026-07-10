from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()


# =====================================================
# DATABASE CONNECTION
# =====================================================

def get_connection():
    return psycopg2.connect(
        host="localhost",
        port="5432",
        database="medical_ai",
        user="postgres",
        password="kishor0206"
    )


# =====================================================
# CORS
# =====================================================

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5186",
        "http://127.0.0.1:5186",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# MODELS
# =====================================================

class Patient(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    email: str
    address: str
    blood_group: str
    symptoms: str
    diagnosis: str


class Doctor(BaseModel):
    name: str
    specialization: str


class Appointment(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: str
    status: str = "Booked"

class SymptomRequest(BaseModel):
    symptoms: str

# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {"message": "Medical AI API Running Successfully"}


# =====================================================
# PATIENT CRUD
# =====================================================

@app.post("/patients")
def create_patient(patient: Patient):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO patients
        (name, age, gender,phone,email,address,blood_group,symptoms, diagnosis)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
        RETURNING id
    """, (
        patient.name,
        patient.age,
        patient.gender,
        patient.phone,
        patient.email,
        patient.address,
        patient.blood_group,
        patient.symptoms,
        patient.diagnosis
    ))

    patient_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Patient created successfully",
        "id": patient_id
    }


@app.get("/patients")
def get_patients():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id,name,age,gender,phone,email,address,blood_group,symptoms,diagnosis
        FROM patients
        ORDER BY id
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "name": row[1],
            "age": row[2],
            "gender": row[3],
            "phone": row[4],
            "email": row[5],
            "address": row[6],
            "blood_group": row[7],
            "symptoms": row[8],
            "diagnosis": row[9]
        }
        for row in rows
    ]


@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
       SELECT
    id,
    name,
    age,
    gender,
    phone,
    email,
    address,
    blood_group,
    symptoms,
    diagnosis
FROM patients
        WHERE id=%s
    """, (patient_id,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return {
         "id": row[0],
            "name": row[1],
            "age": row[2],
            "gender": row[3],
            "phone": row[4],
            "email": row[5],
            "address": row[6],
            "blood_group": row[7],
            "symptoms": row[8],
            "diagnosis": row[9]
    }


@app.put("/patients/{patient_id}")
def update_patient(patient_id: int, patient: Patient):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE patients
        SET
               name=%s,
               age=%s,
               gender=%s,
               phone=%s,
               email=%s,
               address=%s,
               blood_group=%s,
               symptoms=%s,
               diagnosis=%s
           WHERE id=%s
    """, (
    patient.name,
    patient.age,
    patient.gender,
    patient.phone,
    patient.email,
    patient.address,
    patient.blood_group,
    patient.symptoms,
    patient.diagnosis,
    patient_id
))

    conn.commit()

    if cur.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    cur.close()
    conn.close()

    return {"message": "Patient updated successfully"}


@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM patients WHERE id=%s",
        (patient_id,)
    )

    conn.commit()

    if cur.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    cur.close()
    conn.close()

    return {"message": "Patient deleted successfully"}


# =====================================================
# DOCTOR CRUD
# =====================================================

@app.post("/doctors")
def create_doctor(doctor: Doctor):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO doctors
        (name, specialization)
        VALUES (%s, %s)
        RETURNING id
    """, (
        doctor.name,
        doctor.specialization
    ))

    doctor_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Doctor created successfully",
        "id": doctor_id
    }


@app.get("/doctors")
def get_doctors():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id,name,specialization
        FROM doctors
        ORDER BY id
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "name": row[1],
            "specialization": row[2]
        }
        for row in rows
    ]


@app.get("/doctors/{doctor_id}")
def get_doctor(doctor_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id,name,specialization
        FROM doctors
        WHERE id=%s
    """, (doctor_id,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    return {
        "id": row[0],
        "name": row[1],
        "specialization": row[2]
    }


@app.put("/appointments/{appointment_id}/status")
def update_status(
    appointment_id: int,
    status: str
):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE appointments
        SET status=%s
        WHERE id=%s
    """, (
        status,
        appointment_id
    ))

    conn.commit()

    cur.close()
    conn.close()

    return {
        "message": "Status updated"
    }


@app.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM doctors WHERE id=%s",
        (doctor_id,)
    )

    conn.commit()

    if cur.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    cur.close()
    conn.close()

    return {"message": "Doctor deleted successfully"}


# =====================================================
# APPOINTMENT CRUD
# =====================================================

@app.post("/appointments")
def create_appointment(appointment: Appointment):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO appointments
        (
            patient_id,
            doctor_id,
            appointment_date,
            status
        )
        VALUES (%s,%s,%s,%s)
        RETURNING id
    """, (
        appointment.patient_id,
        appointment.doctor_id,
        appointment.appointment_date,
        appointment.status
    ))

    appointment_id = cur.fetchone()[0]

    conn.commit()

    cur.close()
    conn.close()

    return {
        "message": "Appointment booked successfully",
        "id": appointment_id
    }

@app.get("/appointments")
def get_appointments():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            a.id,
            p.name,
            d.name,
            a.appointment_date,
            a.status
        FROM appointments a
        JOIN patients p
            ON a.patient_id = p.id
        JOIN doctors d
            ON a.doctor_id = d.id
        ORDER BY a.id
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "patient": row[1],
            "doctor": row[2],
            "appointment_date": row[3],
            "status": row[4]
        }
        for row in rows
    ]

@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM appointments WHERE id=%s",
        (appointment_id,)
    )

    conn.commit()

    if cur.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    cur.close()

    conn.close()

    return {"message": "Appointment cancelled successfully"}
@app.get("/dashboard")
def dashboard():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM patients")
    total_patients = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM doctors")
    total_doctors = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM appointments")
    total_appointments = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments
    }
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        
    )
    # =====================================================
# AI DIAGNOSIS MODEL
# =====================================================

class SymptomRequest(BaseModel):
    symptoms: str
# =====================================================
# AI DIAGNOSIS MODEL
# =====================================================

class SymptomRequest(BaseModel):
    symptoms: str


# =====================================================
# AI DIAGNOSIS
# =====================================================

@app.post("/ai-diagnosis")
def ai_diagnosis(data: SymptomRequest):

    symptoms = data.symptoms.lower()

    if "fever" in symptoms and "cough" in symptoms:
        prediction = "Possible Flu or Viral Infection"

    elif "headache" in symptoms:
        prediction = "Possible Migraine"

    elif "chest pain" in symptoms:
        prediction = "Possible Cardiac Issue"

    elif "stomach pain" in symptoms:
        prediction = "Possible Gastritis or Digestive Problem"

    elif "sore throat" in symptoms:
        prediction = "Possible Throat Infection"

    elif "cold" in symptoms or "runny nose" in symptoms:
        prediction = "Possible Common Cold"

    elif "body pain" in symptoms and "fever" in symptoms:
        prediction = "Possible Dengue or Viral Fever"

    elif "vomiting" in symptoms:
        prediction = "Possible Food Poisoning"

    elif "diarrhea" in symptoms:
        prediction = "Possible Gastrointestinal Infection"

    elif "shortness of breath" in symptoms:
        prediction = "Possible Respiratory Condition"

    else:
        prediction = "Symptoms unclear. Please consult a doctor."

    return {
        "symptoms": data.symptoms,
        "prediction": prediction
    }
@app.get("/patients/{patient_id}/appointments")
def patient_appointments(patient_id: int):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            a.id,
            d.name,
            a.appointment_date,
            a.status
        FROM appointments a
        JOIN doctors d
            ON a.doctor_id = d.id
        WHERE a.patient_id = %s
        ORDER BY a.appointment_date DESC
    """, (patient_id,))

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "doctor": row[1],
            "appointment_date": row[2],
            "status": row[3]
        }
        for row in rows
    ]
@app.get("/doctors/{doctor_id}/details")
def doctor_details(doctor_id: int):

    conn = get_connection()
    cur = conn.cursor()

    # Doctor info
    cur.execute("""
        SELECT
            id,
            name,
            specialization
        FROM doctors
        WHERE id=%s
    """, (doctor_id,))

    doctor = cur.fetchone()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    # Appointment history
    cur.execute("""
        SELECT
            a.id,
            p.name,
            a.appointment_date,
            a.status
        FROM appointments a
        JOIN patients p
        ON a.patient_id = p.id
        WHERE a.doctor_id=%s
        ORDER BY a.appointment_date DESC
    """, (doctor_id,))

    appointments = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "doctor": {
            "id": doctor[0],
            "name": doctor[1],
            "specialization": doctor[2]
        },
        "appointments": [
            {
                "id": row[0],
                "patient": row[1],
                "appointment_date": row[2],
                "status": row[3]
            }
            for row in appointments
        ]
    }
class DoctorRecommendationRequest(BaseModel):
    symptoms: str


@app.post("/recommend-doctor")
def recommend_doctor(data: DoctorRecommendationRequest):

    symptoms = data.symptoms.lower()

    specialization = "General Medicine"

    if "heart" in symptoms or "chest pain" in symptoms:
        specialization = "Cardiology"

    elif "skin" in symptoms or "rash" in symptoms:
        specialization = "Dermatology"

    elif "bone" in symptoms or "joint" in symptoms:
        specialization = "Orthopedics"

    elif "eye" in symptoms:
        specialization = "Ophthalmology"

    elif "brain" in symptoms or "headache" in symptoms:
        specialization = "Neurology"

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id,name,specialization
        FROM doctors
        WHERE specialization ILIKE %s
        LIMIT 1
    """, (f"%{specialization}%",))

    doctor = cur.fetchone()

    cur.close()
    conn.close()

    if doctor:
        return {
            "recommended_doctor": doctor[1],
            "doctor_id": doctor[0],
            "specialization": doctor[2],
            "confidence": "95%"
        }

    return {
        "recommended_doctor": None,
        "specialization": specialization,
        "confidence": "70%"
    }
