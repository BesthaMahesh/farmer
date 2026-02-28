# 🌾 Farmer AI Advisory Tool

An AI-powered crop planning and advisory system for farmers.

## 📁 Project Structure

```
farmer/
│
├── backend/             # Flask API Server
│   ├── app.py           # Main Flask app (ML predictions + OpenAI advisory)
│   ├── utils.py         # Weather & Market API helpers
│   ├── train_model.py   # Script to train the ML model
│   ├── database.py      # MongoDB connection (optional)
│   ├── requirements.txt # Python dependencies
│   ├── .env.example     # Environment variable template
│   └── models/          # Saved ML model files (generated after training)
│       ├── crop_model.pkl
│       └── features.pkl
│
├── ml/                  # Jupyter Notebooks for model training
│   ├── crop_training.ipynb  # ✅ Full crop recommendation training pipeline
│   └── cnn_training.ipynb   # 🚧 CNN disease detection (placeholder)
│
├── frontend/            # React Web Application (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       ├── Dashboard.jsx
│   │       ├── RecommendationForm.jsx
│   │       └── Advisory.jsx
│   ├── package.json
│   └── vite.config.js
│
└── dataset/             # Training Datasets
    └── Crop_recommendation.csv  ← Place your dataset here
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python train_model.py       # Train the model first
python app.py               # Start Flask on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev                 # Start dev server on http://localhost:5173
```

### 3. Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in your API keys:
```
OPENAI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
```

## 🧠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React, Vite, Tailwind CSS, Axios  |
| Backend     | Flask, Scikit-learn, OpenAI SDK   |
| ML Models   | Random Forest (Crop Prediction)   |
| AI Advisory | GPT-3.5 Turbo (OpenAI)            |
