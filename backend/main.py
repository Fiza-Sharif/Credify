import os
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Credify Loan Approval API",
    description="FastAPI backend powered by KNN Machine Learning model trained on loan approval dataset.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for loaded sklearn pipeline
pipeline = None

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINE_PATH = os.path.join(BASE_DIR, "model", "knn_pipeline.joblib")

@app.on_event("startup")
def load_artifacts():
    global pipeline
    try:
        if not os.path.exists(PIPELINE_PATH):
            print("Pipeline artifact not found. Training model now...")
            from train_model import train_and_save_model
            train_and_save_model()
            
        pipeline = joblib.load(PIPELINE_PATH)
        print("Unified Sklearn KNN Pipeline loaded successfully!")
    except Exception as e:
        print(f"Error loading pipeline artifact: {e}")
        raise e


class LoanApplicationRequest(BaseModel):
    Gender: str = Field(..., description="Gender of applicant: Male or Female")
    Married: str = Field(..., description="Marital status: Yes or No")
    Dependents: str = Field(..., description="Number of dependents: 0, 1, 2, 3+")
    Education: str = Field(..., description="Education status: Graduate or Not Graduate")
    Self_Employed: str = Field(..., description="Self employment status: Yes or No")
    ApplicantIncome: float = Field(..., ge=0, description="Applicant income in USD")
    CoapplicantIncome: float = Field(..., ge=0, description="Co-applicant income in USD")
    LoanAmount: float = Field(..., ge=0, description="Loan amount in thousands (or USD)")
    Loan_Amount_Term: float = Field(..., ge=0, description="Loan term in months")
    Credit_History: float = Field(..., description="Credit history: 1 (Good) or 0 (Bad)")
    Property_Area: str = Field(..., description="Property area: Urban, Semiurban, or Rural")

    class Config:
        json_schema_extra = {
            "example": {
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
        }


@app.get("/")
def read_root():
    return {
        "service": "Credify Loan Approval Prediction API",
        "status": "online",
        "model": "K-Nearest Neighbors (KNN, K=7)",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": pipeline is not None
    }


@app.post("/predict")
def predict_loan_approval(applicant: LoanApplicationRequest):
    if pipeline is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model pipeline is not available."
        )

    try:
        # Convert Pydantic request to pandas DataFrame matching feature names
        data_dict = applicant.model_dump()
        df_input = pd.DataFrame([data_dict])

        # Execute direct prediction via master sklearn Pipeline
        prediction_val = int(pipeline.predict(df_input)[0])
        probabilities = pipeline.predict_proba(df_input)[0]

        # Extract true confidence percentage for the predicted outcome
        confidence_pct = round(float(probabilities[prediction_val]) * 100, 1)

        is_approved = (prediction_val == 1)

        return {
            "prediction": "Approved" if is_approved else "Rejected",
            "status": "approved" if is_approved else "rejected",
            "confidence": confidence_pct,
            "details": {
                "applicant_income": applicant.ApplicantIncome,
                "coapplicant_income": applicant.CoapplicantIncome,
                "loan_amount": applicant.LoanAmount,
                "credit_history": applicant.Credit_History,
                "property_area": applicant.Property_Area,
                "class_probabilities": {
                    "approved_pct": round(float(probabilities[1]) * 100, 1),
                    "rejected_pct": round(float(probabilities[0]) * 100, 1)
                }
            }
        }

    except Exception as e:
        print(f"Prediction Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing loan prediction: {str(e)}"
        )
