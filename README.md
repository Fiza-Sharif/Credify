# Credify - Precision AI Loan Approval Predictor

Credify is a full-stack loan approval prediction web application built with a **Next.js** frontend, a **Python FastAPI** backend microservice, and a trained **K-Nearest Neighbors (KNN)** Machine Learning classification model.

---

## Project Overview & Architecture

```
User enters applicant parameters
         │
         ▼
Next.js Frontend (http://localhost:3000)
         │
         ▼ (POST /predict)
FastAPI Backend (http://localhost:8000)
         │
         ▼
Data Preprocessing (Imputation + Dummy Encoding + StandardScaler)
         │
         ▼
Trained KNN Classification Model (K=7, 77.24% Accuracy)
         │
         ▼
Verdict Response (Approved / Rejected)
         │
         ▼
Dynamic UI Result Card Display
```

---

## Technologies Used

- **Frontend**: Next.js 14/16 (App Router), React 19, Tailwind CSS v4, TypeScript, Google Fonts (Manrope, Inter, Geist), Material Symbols.
- **Backend**: FastAPI, Uvicorn, Pydantic v2, CORS Middleware.
- **Machine Learning**: Scikit-learn (KNeighborsClassifier, StandardScaler), Pandas, NumPy, Joblib.
- **Dataset**: `train.csv` (Loan Prediction Dataset).

---

## Project Structure

```
Credify/
├── frontend/                  # Next.js Application
│   ├── app/
│   │   ├── components/       # Shared UI Components (Navbar, Footer, LogoImage)
│   │   ├── predict/          # Interactive Loan Prediction Form & Result Card
│   │   ├── dashboard/        # Analytics & System Metrics Dashboard
│   │   ├── how-it-works/     # Architecture & Methodology Guide
│   │   ├── about/            # About Credify AI
│   │   ├── signup/           # Account Creation Page
│   │   ├── layout.tsx        # Root Layout with Font & Theme Setup
│   │   ├── page.tsx          # Landing / Home Page
│   │   └── globals.css       # Custom Theme Tokens & Luxury Styling
│   ├── public/
│   │   └── Credify_Logo.PNG  # Logo Asset
│   ├── .env.local            # Environment Variable (NEXT_PUBLIC_API_URL)
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                   # Python FastAPI Microservice
│   ├── model/
│   │   ├── knn_model.joblib  # Serialized KNN Classifier
│   │   └── pipeline.joblib   # Serialized Scaler, Feature Names, Medians & Modes
│   ├── train_model.py        # ML Training Pipeline Script
│   ├── main.py               # FastAPI Server Application
│   ├── train.csv             # Training Dataset
│   └── requirements.txt      # Python Dependencies
│
├── Loan_Predict.ipynb         # Original Notebook Analysis & Modeling
├── implementation_plan.md    # Technical Plan Artifact
└── README.md                 # Documentation
```

---

## Quick Start Guide

### 1. Backend Setup & Model Training

```bash
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Mac/Linux:
source .venv/bin/activate

# Install Python requirements
pip install -r requirements.txt

# Train KNN Model and Save Artifacts
python train_model.py

# Start FastAPI Server
uvicorn main:app --host 0.0.0.0 --port 8000
```

FastAPI server runs at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 2. Frontend Setup & Execution

```bash
cd frontend

# Install Node.js dependencies
npm install

# Set environment variable in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run Next.js Development Server
npm run dev
```

Next.js web application runs at: **`http://localhost:3000`**

---

## Machine Learning Preprocessing Details

The exact preprocessing pipeline defined during training is automatically applied at inference time:

1. **Numerical Imputation**: Missing values filled with feature medians (`ApplicantIncome`, `CoapplicantIncome`, `LoanAmount`, `Loan_Amount_Term`, `Credit_History`).
2. **Categorical Imputation**: Missing values filled with feature modes (`Gender`, `Married`, `Dependents`, `Education`, `Self_Employed`, `Property_Area`).
3. **Identifier Removal**: `Loan_ID` is removed as non-predictive.
4. **Categorical One-Hot Encoding**: Converted via `pd.get_dummies(..., drop_first=True)`.
5. **Feature Standardization**: Scaled with `StandardScaler`.
6. **Model**: `KNeighborsClassifier` tuned with `K=7` achieving **77.24% accuracy** on the test dataset.

---

## API Endpoint Specification

### `POST /predict`

#### Request Payload (JSON)
```json
{
  "Gender": "Male",
  "Married": "Yes",
  "Dependents": "0",
  "Education": "Graduate",
  "Self_Employed": "No",
  "ApplicantIncome": 5849,
  "CoapplicantIncome": 0,
  "LoanAmount": 128,
  "Loan_Amount_Term": 360,
  "Credit_History": 1.0,
  "Property_Area": "Urban"
}
```

#### Approved Response (JSON)
```json
{
  "prediction": "Approved",
  "status": "approved",
  "confidence": 71.4,
  "details": {
    "applicant_income": 5849.0,
    "coapplicant_income": 0.0,
    "loan_amount": 128.0,
    "credit_history": 1.0,
    "property_area": "Urban"
  }
}
```

#### Rejected Response (JSON)
```json
{
  "prediction": "Rejected",
  "status": "rejected",
  "confidence": 42.9,
  "details": {
    "applicant_income": 1000.0,
    "coapplicant_income": 0.0,
    "loan_amount": 500.0,
    "credit_history": 0.0,
    "property_area": "Rural"
  }
}
```
