"""
HealthGuard AI - Backend API
------------------------------
This is a LEARNING/DEMO prototype for a hackathon project.
It uses a pre-trained Logistic Regression model on SYNTHETIC data
to predict a risk level (Low / Medium / High).

IMPORTANT: This is NOT a real medical diagnostic system.
"""

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import joblib
import pandas as pd


# ---------------------------------------------------------
# 1. SET UP ROBUST FILE PATHS USING pathlib
# ---------------------------------------------------------

# __file__ = location of this main.py file
# .parent = backend folder
# .parent.parent = HealthGuardAI project folder

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "model" / "healthguard_model.pkl"
SCALER_PATH = BASE_DIR / "model" / "healthguard_scaler.pkl"


# ---------------------------------------------------------
# 2. LOAD THE MODEL AND SCALER ONCE AT STARTUP
# ---------------------------------------------------------

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

except FileNotFoundError as e:
    raise RuntimeError(
        f"Could not find model/scaler file. "
        f"Check the model folder and file names. Details: {e}"
    )

except Exception as e:
    raise RuntimeError(
        f"Failed to load model or scaler: {e}"
    )


# ---------------------------------------------------------
# 3. CREATE THE FASTAPI APPLICATION
# ---------------------------------------------------------

app = FastAPI(
    title="HealthGuard AI Backend",
    description="Backend API for the HealthGuard AI learning prototype",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# 4. DEFINE THE PATIENT DATA STRUCTURE
# ---------------------------------------------------------

class PatientData(BaseModel):

    age: int = Field(
        ...,
        ge=1,
        le=120,
        description="Age in years (1-120)"
    )

    bmi: float = Field(
        ...,
        ge=10,
        le=60,
        description="Body Mass Index (10-60)"
    )

    blood_pressure: float = Field(
        ...,
        gt=0,
        description="Blood pressure, must be positive"
    )

    glucose: float = Field(
        ...,
        gt=0,
        description="Glucose level, must be positive"
    )

    cholesterol: float = Field(
        ...,
        gt=0,
        description="Cholesterol level, must be positive"
    )

    smoking: int = Field(
        ...,
        ge=0,
        le=1,
        description="0 = No, 1 = Yes"
    )

    activity: int = Field(
        ...,
        ge=0,
        le=1,
        description="0 = Inactive, 1 = Active"
    )

    medical_history: int = Field(
        ...,
        ge=0,
        le=1,
        description="0 = No history, 1 = Has history"
    )


# ---------------------------------------------------------
# 5. ROOT ENDPOINT
# ---------------------------------------------------------

@app.get("/")
def read_root():

    return {
        "message": "HealthGuard AI Backend is running"
    }


# ---------------------------------------------------------
# 6. PREDICTION ENDPOINT
# ---------------------------------------------------------

@app.post("/predict")
def predict_risk(patient: PatientData):

    try:

        # -------------------------------------------------
        # 6a. CREATE DATA IN THE EXACT TRAINING ORDER
        # -------------------------------------------------

        features = pd.DataFrame([{
            "Age": patient.age,
            "BMI": patient.bmi,
            "BloodPressure": patient.blood_pressure,
            "Glucose": patient.glucose,
            "Cholesterol": patient.cholesterol,
            "Smoking": patient.smoking,
            "Activity": patient.activity,
            "MedicalHistory": patient.medical_history
        }])


        # -------------------------------------------------
        # 6b. APPLY THE ALREADY-FITTED SCALER
        # -------------------------------------------------

        # IMPORTANT:
        # Use transform(), NOT fit_transform().
        #
        # The scaler already learned the required values
        # during model training.

        scaled_features = scaler.transform(features)


        # -------------------------------------------------
        # 6c. MAKE THE RISK PREDICTION
        # -------------------------------------------------

        prediction = model.predict(scaled_features)[0]


        # -------------------------------------------------
        # 6d. GET PROBABILITIES FOR EACH CLASS
        # -------------------------------------------------

        probabilities = model.predict_proba(
            scaled_features
        )[0]

        probability_dict = {
            str(class_name): round(float(probability), 4)
            for class_name, probability
            in zip(model.classes_, probabilities)
        }


        # -------------------------------------------------
        # 6e. RETURN THE RESULT
        # -------------------------------------------------

        return {
            "risk_level": str(prediction),
            "probabilities": probability_dict
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )