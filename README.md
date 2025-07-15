# Oxyera Patient's Medication Management

This project is a full-stack application for managing patients and their medication assignments, built with NestJS for the backend and Next.js for the frontend. It includes CRUD operations for patients and medications, as well as functionality to assign medications to patients and calculate remaining treatment days.

### Backend Endpoints
- **Patients**:
  - `GET /patient`: Retrieve all patients with pagination and filtering by patient's name.
  - `POST /patient`: Create a new patient.
- **Medications**:
  - `GET /medication`: Retrieve all medications with pagination and filtering by medication name.
  - `POST /medication`: Create a new medication.
- **Assignments**:
  - `GET /assignment`: Retrieve all medication assignments with pagination and filtering by patient & medication.
  - `POST /assignment`: Assign a medication to a patient.
- **Swagger Documentation**: 
  - `GET /swagger`: Access the Swagger UI for API documentation.

### Frontend Pages
- **Patients**: `/patients`
  - View all patients
  - Create a new patient
- **Medications**: `/medications`
  - View all medications
  - Create a new medication
- **Assignments**: `/assignments`
  - Assign medications to patients
  - View all assignments

Notes: Please use `0.0.0.0` as the host when running the application locally to ensure it is not blocked by CORS policy.

## Getting Started
### Running using Docker
To run the application using Docker, run this command in the root directory of the project:

```bash
docker compose up --build
```

### Running Locally
1. **Backend**: Navigate to the `backend` directory and run:
   ```bash
   pnpm install
   ```
2. **Frontend**: Navigate to the `frontend` directory and run:
   ```bash
   pnpm install
   ```
3. To **run the Servers concurrently**, run this command in the root directory of the project:
   ```bash
   pnpm run dev
   ```