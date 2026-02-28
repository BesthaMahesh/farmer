import torch
import torch.nn as nn
from torchvision import models
import os
import requests
import io
from PIL import Image

# Create a dummy model to simulate cnn_model.pt
def create_dummy_model():
    model = models.mobilenet_v2(pretrained=False)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.BatchNorm1d(256),
        nn.Dropout(p=0.3),
        nn.Linear(256, 4)
    )
    
    save_path = 'backend/models/cnn_model.pt'
    os.makedirs('backend/models', exist_ok=True)
    
    torch.save({
        'model_state_dict': model.state_dict(),
        'class_names': ['healthy', 'multiple_diseases', 'rust', 'scab'],
        'img_size': 224
    }, save_path)
    print(f"✅ Created dummy model at {save_path}")

if __name__ == "__main__":
    if not os.path.exists('backend/models/cnn_model.pt'):
        create_dummy_model()
    
    # Test image
    img = Image.new('RGB', (224, 224), color='green')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    print("🚀 Testing API endpoint /api/detect-disease...")
    try:
        files = {'image': ('test.jpg', img_byte_arr, 'image/jpeg')}
        response = requests.post('http://localhost:5000/api/detect-disease', files=files)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Connection Error: {e}")
        print("💡 Make sure the Flask app is running (python backend/app.py)")
