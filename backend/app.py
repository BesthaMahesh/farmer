import os
import joblib
import pandas as pd
import numpy as np
import requests
from PIL import Image
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_weather_data, get_market_prices
import io

# Fix for WinError 1114 (DLL load failure) common on Windows/Anaconda
# No more PyTorch needed in the backend! This avoids DLL Load issues (WinError 1114).

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load Models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.pkl')
FEATURES_PATH = os.path.join(BASE_DIR, 'models', 'features.pkl')
PLANT_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'plant_disease_nn_model.pkl') # The newly trained model

model = None
features = None
plant_model = None
plant_model_error = None

def load_ml_components():
    global model, features, plant_model, plant_model_error
    
    # Load Crop Recommendation Model
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            features = joblib.load(FEATURES_PATH)
            print("✅ Crop Recommendation Model loaded.")
        except Exception as e:
            print(f"Error loading Crop model: {e}")
    else:
        print("ML Model (Crop) not found.")

    # Load Plant Disease Model (Trained with Scikit-Learn)
    if os.path.exists(PLANT_MODEL_PATH):
        try:
            plant_model = joblib.load(PLANT_MODEL_PATH)
            plant_model_error = None
            print("✅ Plant Disease Neural Network loaded.")
        except Exception as e:
            plant_model_error = str(e)
            import traceback
            plant_model_error += " | Traceback: " + traceback.format_exc()
            print(f"Error loading Plant Disease model: {e}")
    else:
        plant_model_error = f"Model file not found at {PLANT_MODEL_PATH}"
        print("Plant Disease Model not found. Ensure it is moved to backend/models/")

load_ml_components()

# Image size used during training
IMG_SIZE = 64

# OpenRouter Setup
OPENAI_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
MODEL_ID = "openai/gpt-4o-mini"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "plant_model_loaded": plant_model is not None,
        "plant_model_error": plant_model_error
    }), 200

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', 'Nandyal')
    weather = get_weather_data(city)
    return jsonify(weather), 200

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        # Expecting: N, P, K, ph, city
        
        weather = get_weather_data(data.get('city', 'Nandyal'))
        
        # Prepare features for prediction
        input_data = pd.DataFrame([{
            'N': data.get('N', 0),
            'P': data.get('P', 0),
            'K': data.get('K', 0),
            'temperature': weather['temp'],
            'humidity': weather['humidity'],
            'ph': data.get('ph', 6.5),
            'rainfall': weather['rainfall']
        }])
        
        if model:
            prediction = model.predict(input_data)[0]
            confidence = max(model.predict_proba(input_data)[0])
        else:
            prediction = "Rice" # Fallback
            confidence = 0.5
            
        market = get_market_prices(prediction)
        
        result = {
            "crop": prediction,
            "confidence": float(confidence),
            "weather": weather,
            "market": market
        }
        

        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ask-ai', methods=['POST'])
def ask_ai():
    try:
        data = request.json
        question = data.get('question', '')
        
        load_dotenv(override=True)
        current_api_key = os.getenv("OPENAI_API_KEY", OPENAI_API_KEY)
        
        if not current_api_key:
            return jsonify({"answer": "OpenRouter API Key is missing."}), 200

        headers = {
            "Authorization": f"Bearer {current_api_key}",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Farmer AI",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": MODEL_ID,
            "messages": [
                {"role": "system", "content": "You are a helpful agricultural expert advisor."},
                {"role": "user", "content": question}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }

        response = requests.post(OPENAI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            print(f"OPENAI ERROR ({response.status_code}): {response.text}")
            try:
                err_content = response.json()
                msg = err_content.get("error", {}).get("message", response.text)
            except:
                msg = response.text
            return jsonify({"answer": f"AI Service Error: {msg[:200]}"}), 200

        output = response.json()
        print(f"OPENAI DEBUG: {output}")

        if "choices" in output and len(output["choices"]) > 0:
            answer = output["choices"][0]["message"]["content"].strip()
        else:
            answer = "Sorry, I couldn't get a valid response from the AI."

        return jsonify({"answer": answer}), 200
        
    except Exception as e:
        print(f"AI Advisor Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect-disease', methods=['POST'])
def detect_disease():
    if not plant_model:
        return jsonify({"error": f"Model failed to load! Error: {plant_model_error}"}), 503
        
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    try:
        file = request.files['image']
        
        # --- AI check for plant content ---
        import base64
        current_api_key = os.getenv("OPENAI_API_KEY", OPENAI_API_KEY)
        
        if current_api_key:
            try:
                img_bytes = file.read()
                file.seek(0)
                
                b64_img = base64.b64encode(img_bytes).decode('utf-8')
                
                payload = {
                    "model": "openai/gpt-4o-mini",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text", 
                                    "text": "Is this an image of a plant, crop, leaf, or agriculture-related item? Reply with 'YES' or 'NO' only."
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{b64_img}"
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 10,
                    "temperature": 0.0
                }
                
                headers = {
                    "Authorization": f"Bearer {current_api_key}",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Farmer AI",
                    "Content-Type": "application/json"
                }
                
                response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=15)
                
                if response.status_code == 200:
                    data = response.json()
                    if "choices" in data and len(data["choices"]) > 0:
                        answer = data["choices"][0]["message"]["content"].strip().upper()
                        if "NO" in answer:
                            return jsonify({"error": "**Not a Plant Detected**\n\nThe image uploaded does not appear to be a plant, crop, or leaf. Please upload a clear photo of a plant to get a disease analysis."}), 400
            except Exception as e:
                print(f"Vision API Warning: {e}")
                file.seek(0)
        # --- END AI check ---

        # Crucial: Reset file pointer to beginning after reading for AI check
        file.seek(0)
        
        # Load image, ensure it is RGB, resize to match training
        img = Image.open(io.BytesIO(file.read())).convert('RGB').resize((IMG_SIZE, IMG_SIZE))
        
        # Flatten image to match training format (64*64*3)
        features_flat = np.array(img).flatten() / 255.0
        features_flat = features_flat.reshape(1, -1)
        
        # Inference
        disease = plant_model.predict(features_flat)[0]
        probs = plant_model.predict_proba(features_flat)[0]
        
        class_names = plant_model.classes_
        pred_idx = list(class_names).index(disease)
        confidence = float(probs[pred_idx])
        
        return jsonify({
            "disease": disease,
            "confidence": confidence,
            "all_scores": {name: float(p) for name, p in zip(class_names, probs)}
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/market-trends', methods=['GET'])
def market_trends():
    # In a real app, this would fetch from an external API or DB
    # Returning enriched mock data for the demo
    crops = ['Rice', 'Maize', 'Cotton', 'Jute', 'Wheat', 'Soybean']
    data = []
    import random
    
    for crop in crops:
        base_price = random.randint(2000, 8000)
        change = random.uniform(-5, 5)
        data.append({
            "crop": crop,
            "price": f"₹{base_price}/quintal",
            "trend": "up" if change > 0 else "down",
            "change": f"{abs(change):.1f}%",
            "demand": random.choice(["High", "Medium", "Stable"])
        })
        
    return jsonify(data), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
