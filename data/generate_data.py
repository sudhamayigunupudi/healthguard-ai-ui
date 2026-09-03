"""
generate_data.py

Generates a SYNTHETIC patient dataset for the HealthGuard AI hackathon project.

IMPORTANT DISCLAIMER:
----------------------
This dataset is 100% artificial. It does NOT come from real patients and it
does NOT represent real medical knowledge. The rule used below to decide
RiskLevel is a made-up rule created only so that we have a labeled dataset
to demonstrate a machine learning pipeline (data -> model -> predictions).
This project is NOT a medical diagnostic tool and must never be treated as one.
"""

import numpy as np
import pandas as pd
import os

# Set a random seed so that every time we run this script we get the
# exact same "random" numbers. This makes our results reproducible.
np.random.seed(42)

# Number of synthetic patients to generate
NUM_PATIENTS = 500

# -----------------------------
# STEP 1: Generate raw features
# -----------------------------

# Age: reasonable adult range
age = np.random.randint(18, 90, size=NUM_PATIENTS)

# BMI (Body Mass Index): realistic range, roughly 15 to 45
bmi = np.round(np.random.normal(loc=26, scale=5, size=NUM_PATIENTS), 1)
bmi = np.clip(bmi, 15, 45)

# Blood Pressure (systolic, mmHg): realistic range roughly 90 to 180
blood_pressure = np.round(np.random.normal(loc=125, scale=15, size=NUM_PATIENTS)).astype(int)
blood_pressure = np.clip(blood_pressure, 90, 180)

# Glucose (mg/dL): realistic fasting glucose range roughly 70 to 200
glucose = np.round(np.random.normal(loc=110, scale=25, size=NUM_PATIENTS)).astype(int)
glucose = np.clip(glucose, 70, 200)

# Cholesterol (mg/dL): realistic range roughly 120 to 300
cholesterol = np.round(np.random.normal(loc=200, scale=35, size=NUM_PATIENTS)).astype(int)
cholesterol = np.clip(cholesterol, 120, 300)

# Smoking: binary (0 = non-smoker, 1 = smoker)
smoking = np.random.choice([0, 1], size=NUM_PATIENTS, p=[0.75, 0.25])

# Activity: binary (1 = physically active, 0 = not active)
# Note: 1 here means "active" which is a GOOD thing (lowers risk).
activity = np.random.choice([0, 1], size=NUM_PATIENTS, p=[0.45, 0.55])

# MedicalHistory: binary (1 = has a relevant prior medical history, 0 = none)
medical_history = np.random.choice([0, 1], size=NUM_PATIENTS, p=[0.7, 0.3])

# -----------------------------------------
# STEP 2: Build an ARTIFICIAL risk formula
# -----------------------------------------
# This is NOT a real medical formula. It is a simple weighted "risk score"
# that we invented so that the features actually relate to the label in a
# learnable way. Each condition below adds points to a patient's risk score.

risk_score = np.zeros(NUM_PATIENTS)

risk_score += (age > 60) * 2
risk_score += (age > 45) * 1

risk_score += (bmi > 30) * 2
risk_score += (bmi > 25) * 1

risk_score += (blood_pressure > 140) * 2
risk_score += (blood_pressure > 120) * 1

risk_score += (glucose > 140) * 2
risk_score += (glucose > 100) * 1

risk_score += (cholesterol > 240) * 2
risk_score += (cholesterol > 200) * 1

risk_score += smoking * 2
risk_score += medical_history * 2
risk_score += (activity == 0) * 1  # being inactive adds risk

# Add a small amount of random noise so the boundary between classes
# isn't perfectly clean (more realistic for a demo ML problem).
noise = np.random.normal(loc=0, scale=1.0, size=NUM_PATIENTS)
risk_score_noisy = risk_score + noise

# -----------------------------------------
# STEP 3: Convert the numeric score into Low / Medium / High labels
# -----------------------------------------
# These cutoffs were chosen manually just to produce a reasonable spread
# of the three classes. They are artificial thresholds, not medical ones.


def score_to_label(score):
    if score < 4:
        return "Low"
    elif score < 8:
        return "Medium"
    else:
        return "High"


risk_level = [score_to_label(s) for s in risk_score_noisy]

# -----------------------------
# STEP 4: Assemble the DataFrame
# -----------------------------

df = pd.DataFrame({
    "Age": age,
    "BMI": bmi,
    "BloodPressure": blood_pressure,
    "Glucose": glucose,
    "Cholesterol": cholesterol,
    "Smoking": smoking,
    "Activity": activity,
    "MedicalHistory": medical_history,
    "RiskLevel": risk_level
})

# -----------------------------
# STEP 5: Save to CSV
# -----------------------------

# Make sure the path works no matter where the script is called from,
# as long as it's run from within the HealthGuard-AI project.
output_path = os.path.join(os.path.dirname(__file__), "patients.csv")
df.to_csv(output_path, index=False)

# -----------------------------
# STEP 6: Print summary info
# -----------------------------

print("First 5 rows of the synthetic dataset:")
print(df.head())

print("\nDataset shape (rows, columns):")
print(df.shape)

print("\nRiskLevel distribution:")
print(df["RiskLevel"].value_counts())

print(f"\nSaved synthetic dataset to: {output_path}")
