# 🚀 Oxyera Async Interview Challenge

Hi! 👋 Welcome to the Oxyera async technical challenge. This test will help us evaluate your independence, code quality, organization, and technical decisions without ambiguity, so you can focus on delivering your best work.

---

## 🎯 The Challenge

### 📝 Description

In this async challenge, you will build a full-stack mini-app to manage patients, medications, and their treatment assignments for a digital health workflow.

You will implement CRUD APIs using NestJS with a SQLite database (already configured) and a minimal Next.js frontend to interact with these APIs. A patient can have multiple medication assignments, and you will implement logic to calculate the remaining days of each treatment automatically.

The goal is to evaluate your ability to:

- Deliver clear, scalable, maintainable code.

- Handle clean API design and testing.

- Build a simple, functional UI connected to your backend.

- Manage your workflow independently with clear commits.

This test simulates real work at Oxyera: you will receive a task, execute it end-to-end, and submit it for review, demonstrating your ownership and technical skills without requiring continuous oversight.

### ✅ What will you implement 

✅ **Backend (NestJS, runs on port **`8080`**)**

- CRUD endpoints for:
  - `Patient` (name, date of birth)
  - `Medication` (name, dosage, frequency)
  - `Assignment` (assign a medication to a patient with a start date and number of days)
- **A patient can have multiple medication assignments**.
- Endpoint to calculate and return **remaining days of treatment** for each assignment (based on start date + days - today).
- Endpoints should:
  - Return clear, structured JSON.
  - Validate input (e.g., required fields, valid dates).
  - Return appropriate HTTP status codes.
  - Be covered with at least **one unit test for calculation logic**.

✅ **Frontend (Next.js, runs on port **`3000`**)**

- Multiple pages with Tailwind for styling.
- Features:
  - List patients with their assignments and remaining treatment days.
  - Forms to create:
    - Patients
    - Medications
    - Assign medications to patients.
- Display **remaining treatment days clearly per assignment**.
- Use a **global constant for backend URL** for clarity.

✅ Use the **SQLite DB already configured in **``.

✅ Commit clearly and progressively, showing your reasoning in your commit messages.

✅ Use **TypeScript** everywhere.

✅ Structure your code cleanly to reflect scalability.

---

## ⚡ What We’re Evaluating

- Clear and scalable folder structure.
- Proper API design and HTTP handling.
- Input validation and error handling.
- Consistent, readable code.
- Use of TypeScript types for safety.
- Test quality and coverage of core logic.
- Ability to deliver a working feature with clean commits.
- UI clarity and correct functional connection with your backend.

---

## 🚀 Running the Project

**Backend:**

```bash
cd backend
npm install
npm run start:dev
```

Access on `http://0.0.0.0:8080`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Access on `http://0.0.0.0:3000`.

The SQLite database is located at `backend/database.sqlite`.

---

## 📩 Submission

✅ Complete by one week after you recieved the assignment. 

✅ Push to your your personal forked repo. 

✅ Email your repo link to [dev@oxyera.com](mailto\:dev@oxyera.com).

Thank you for your interest in Oxyera. We look forward to reviewing your structured, clear, and working solution!

