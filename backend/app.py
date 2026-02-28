import os
import joblib
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_weather_data, get_market_prices
from openai import OpenAI
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

# Fix for WinError 1114 (DLL load failure) common on Windows/Anaconda
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load Model
MODEL_PATH = 'models/crop_model.pkl'
FEATURES_PATH = 'models/features.pkl'
CNN_MODEL_PATH = 'models/cnn_model.pt'

model = None
features = None
cnn_model = None
cnn_meta = None

# Device for CNN
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_ml_components():
    global model, features, cnn_model, cnn_meta
    
    # Load Crop Recommendation Model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        features = joblib.load(FEATURES_PATH)
    else:
        print("ML Model (Crop) not found. Please run crop_training.ipynb first.")

    # Load CNN Disease Detection Model
    if os.path.exists(CNN_MODEL_PATH):
        try:
            checkpoint = torch.load(CNN_MODEL_PATH, map_location=DEVICE, weights_only=False)
            
            # Reconstruct the specific architecture from training
            # (MobileNetV2 + custom head)
            from torchvision.models import MobileNet_V2_Weights
            
            # Using legacy fallback as in notebook refinement
            try:
                base_model = models.mobilenet_v2(weights=None)
            except:
                base_model = models.mobilenet_v2(pretrained=False)
            
            in_features = base_model.classifier[1].in_features
            base_model.classifier = nn.Sequential(
                nn.Dropout(p=0.4),
                nn.Linear(in_features, 256),
                nn.ReLU(),
                nn.BatchNorm1d(256),
                nn.Dropout(p=0.3),
                nn.Linear(256, 4) # 4 classes
            )
            
            # Load state dict
            if 'model_state_dict' in checkpoint:
                base_model.load_state_dict(checkpoint['model_state_dict'])
                cnn_meta = {k: checkpoint[k] for k in checkpoint if k != 'model_state_dict'}
            else:
                base_model.load_state_dict(checkpoint) # Legacy full save
                
            cnn_model = base_model.to(DEVICE)
            cnn_model.eval()
            print("✅ CNN Disease Model loaded.")
        except Exception as e:
            print(f"Error loading CNN model: {e}")
    else:
        print("CNN Model not found. Please run cnn_training.ipynb first.")

load_ml_components()

# Image Transforms
val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# OpenAI Client
client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": model is not None}), 200

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
        question = data.get('question')
        
        if not client:
            return jsonify({"answer": "OpenAI API Key is missing. Please check your backend .env file."}), 200

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful agricultural expert. Provide advice on crop management, pests, and diseases in simple language."},
                {"role": "user", "content": question}
            ]
        )
        
        return jsonify({"answer": response.choices[0].message.content}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect-disease', methods=['POST'])
def detect_disease():
    if not cnn_model:
        return jsonify({"error": "CNN Model not initialized. Train it first!"}), 503
        
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    try:
        file = request.files['image']
        img = Image.open(file.stream).convert('RGB')
        
        # Inference
        img_t = val_transforms(img).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            outputs = cnn_model(img_t)
            probs = torch.softmax(outputs, dim=1)[0].cpu().numpy()
            
        pred_idx = probs.argmax()
        confidence = float(probs[pred_idx])
        
        # Meta info
        class_names = cnn_meta.get('class_names', ['healthy', 'multiple_diseases', 'rust', 'scab']) if cnn_meta else ['healthy', 'multiple_diseases', 'rust', 'scab']
        disease = class_names[pred_idx]
        
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
