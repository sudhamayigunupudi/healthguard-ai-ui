# HealthGuard AI

HealthGuard AI is a learning-focused AI/ML prototype that analyzes synthetic patient information and predicts a health-risk category as **Low, Medium, or High**.

The project demonstrates an end-to-end machine-learning application, from synthetic data generation and model training to a backend API and an interactive frontend dashboard.

> **Disclaimer:** HealthGuard AI is an educational/hackathon prototype. It uses synthetic data and is **not a medical diagnostic system**. The predictions and probabilities are not medically validated and should not be used for real healthcare decisions.

## Features

- Patient information input through a web dashboard
- AI/ML-based risk classification
- Three risk categories:
  - Low
  - Medium
  - High
- Probability output for each risk category
- FastAPI backend for model inference
- Interactive frontend built with React and TypeScript
- Logistic Regression machine-learning model
- Synthetic dataset for training and testing
- Model evaluation using classification metrics

## Machine Learning Workflow

```text
Synthetic Dataset
       ↓
Data Exploration
       ↓
Data Preprocessing
       ↓
Train/Test Split
       ↓
Feature Scaling
       ↓
Logistic Regression
       ↓
Model Evaluation
       ↓
Saved Model
       ↓
FastAPI Prediction API
       ↓
Frontend Dashboard
## Input Features

The model uses the following patient attributes:

- Age
- BMI
- Blood Pressure
- Glucose
- Cholesterol
- Smoking
- Physical Activity
- Medical History

The target variable is:

RiskLevel

The model classifies the patient into three risk categories:

- Low
- Medium
- High

## Project Structure

HealthGuardAI/
│
├── backend/
│   └── main.py
│
├── data/
│   └── synthetic dataset files
│
├── frontend/
│   └── React + TypeScript application
│
├── model/
│   ├── healthguard_model.pkl
│   └── healthguard_scaler.pkl
│
├── notebooks/
│   └── exploration.ipynb
│
├── .gitignore
└── README.md

## Technologies Used

### Machine Learning

- Python
- Pandas
- Scikit-learn
- Logistic Regression
- StandardScaler
- Joblib

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- HTML
- CSS

### Development Tools

- Git
- GitHub
- VS Code

## Model

The prototype uses Logistic Regression as the classification algorithm.

The dataset is divided into training and testing sets. Numerical features are standardized using StandardScaler before being provided to the model.

The trained model and scaler are saved using Joblib and loaded by the FastAPI backend during prediction.

## Running the Project Locally

### 1. Clone the Repository

git clone https://github.com/sudhamayigunupudi/healthguard-ai-ui.git

cd healthguard-ai-ui

### 2. Backend Setup

Create a Python virtual environment:

python -m venv .venv

Activate the virtual environment on Windows:

.venv\Scripts\activate

Install the required Python packages:

pip install pandas scikit-learn joblib fastapi uvicorn pydantic

Start the backend server:

uvicorn backend.main:app --reload

The backend will run at:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open another terminal and enter the frontend directory:

cd frontend

Install the frontend dependencies:

npm install

Start the frontend development server:

npm run dev

The frontend will normally be available at:

http://localhost:8080

## How It Works

1. The user enters patient information in the frontend.
2. The frontend sends the information to the FastAPI /predict endpoint.
3. The backend validates the input.
4. The input features are transformed using the saved scaler.
5. The trained Logistic Regression model generates a prediction.
6. The backend returns the predicted risk level and class probabilities.
7. The frontend displays the result.

## API Endpoint

### POST /predict

Example request:

{
  "age": 50,
  "bmi": 28,
  "blood_pressure": 145,
  "glucose": 150,
  "cholesterol": 220,
  "smoking": 1,
  "activity": 0,
  "medical_history": 1
}

Example response:

{
  "risk_level": "High",
  "probabilities": {
    "High": 0.9962,
    "Low": 0.0,
    "Medium": 0.0038
  }
}

## Important Note About the Dataset

The project uses synthetic data created for demonstration and learning purposes.

Therefore, model performance on this dataset should not be interpreted as evidence that the system can accurately predict real-world medical risk.

## Future Improvements

Possible future improvements include:

- Larger and more realistic datasets
- Additional machine-learning algorithms
- Better model comparison and validation
- Explainable AI techniques
- Improved feature engineering
- Model monitoring
- Cloud deployment
- Secure authentication
- Database integration

## Disclaimer

HealthGuard AI is a student/hackathon learning project. It is not intended to diagnose, treat, prevent, or predict any medical condition in real patients.

All patient information used for development and demonstration is synthetic.

## License

This project is intended for educational and hackathon purposes.
