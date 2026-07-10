# Medical Appointment Booking and Management System

## Overview

The Medical Appointment Booking and Management System is a full-stack healthcare application developed to streamline patient management,
doctor management, and appointment scheduling. The system provides an easy-to-use interface for managing healthcare operations and includes
AI-assisted symptom analysis and doctor recommendation features.

## Features

### Patient Management

* Add new patients
* View patient records
* Update patient information
* Delete patient records
* View patient appointment history

### Doctor Management

* Add doctors and specializations
* View doctor details
* Delete doctor records
* View doctor appointment history

### Appointment Management

* Book appointments
* View all appointments
* Update appointment status
* Cancel appointments
* Track appointment history

### Dashboard Analytics

* Total patients count
* Total doctors count
* Total appointments count

### AI-Based Features

* Symptom-based diagnosis prediction
* Doctor recommendation based on symptoms

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Python
* FastAPI
* Pydantic

### Database

* PostgreSQL
* Psycopg2

### Development Tools

* VS Code
* Postman
* Git & GitHub

---

## System Architecture

```text
React Frontend
       |
       v
FastAPI Backend
       |
       v
PostgreSQL Database
```

---

## Project Structure

```text
Medical-Appointment-System/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── backend/
│   ├── main.py
│   ├── test_db.py
│   └── requirements.txt
│
├── database/
│   └── medical_ai.sql
│
└── README.md
```

---

## Database Tables

### Patients

| Column      | Type               |
| ----------- | ------------------ |
| id          | SERIAL PRIMARY KEY |
| name        | VARCHAR            |
| age         | INTEGER            |
| gender      | VARCHAR            |
| phone       | VARCHAR            |
| email       | VARCHAR            |
| address     | TEXT               |
| blood_group | VARCHAR            |
| symptoms    | TEXT               |
| diagnosis   | TEXT               |

### Doctors

| Column         | Type               |
| -------------- | ------------------ |
| id             | SERIAL PRIMARY KEY |
| name           | VARCHAR            |
| specialization | VARCHAR            |

### Appointments

| Column           | Type               |
| ---------------- | ------------------ |
| id               | SERIAL PRIMARY KEY |
| patient_id       | INTEGER            |
| doctor_id        | INTEGER            |
| appointment_date | DATE               |
| status           | VARCHAR            |

---

## API Endpoints

### Patient APIs

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | /patients      | Create patient    |
| GET    | /patients      | Get all patients  |
| GET    | /patients/{id} | Get patient by ID |
| PUT    | /patients/{id} | Update patient    |
| DELETE | /patients/{id} | Delete patient    |

### Doctor APIs

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| POST   | /doctors      | Create doctor    |
| GET    | /doctors      | Get all doctors  |
| GET    | /doctors/{id} | Get doctor by ID |
| DELETE | /doctors/{id} | Delete doctor    |

### Appointment APIs

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | /appointments             | Book appointment   |
| GET    | /appointments             | View appointments  |
| PUT    | /appointments/{id}/status | Update status      |
| DELETE | /appointments/{id}        | Cancel appointment |

### Additional APIs

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | /dashboard                  | Dashboard statistics  |
| POST   | /ai-diagnosis               | Disease prediction    |
| POST   | /recommend-doctor           | Doctor recommendation |
| GET    | /patients/{id}/appointments | Patient history       |
| GET    | /doctors/{id}/details       | Doctor details        |

---

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/medical-appointment-system.git
cd medical-appointment-system
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure PostgreSQL

Create a database:

```sql
CREATE DATABASE medical_ai;
```

Update database credentials in `main.py`.

### 5. Run Backend

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

### 6. Run Frontend

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## AI Diagnosis Module

The system includes a symptom-based diagnosis module that predicts possible medical conditions based on user-entered symptoms.

Example:

Input:

```text
fever, cough
```

Output:

```text
Possible Flu or Viral Infection
```

---

## Future Enhancements

* JWT Authentication
* Role-Based Access Control
* Email Notifications
* SMS Appointment Reminders
* Online Consultation
* Medical Report Upload
* Prescription Management
* Machine Learning-Based Diagnosis
* Cloud Deployment
* Payment Gateway Integration

---

## Security Improvements

* Use environment variables for database credentials
* Add authentication and authorization
* Implement password hashing
* Add API rate limiting
* Enable HTTPS deployment

---

## Author

Developed by: V KISHOR

Project: Medical Appointment Booking and Management System

Technology Stack: React, FastAPI, PostgreSQL, Python
