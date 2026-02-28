import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import os

def train_model():
    # Look for dataset in the new dataset/ folder (project root level)
    # Falls back to local path if running from a different directory
    dataset_path = '../dataset/Crop_recommendation.csv'
    if not os.path.exists(dataset_path):
        dataset_path = 'Crop_recommendation.csv'  # fallback: same folder
    
    if not os.path.exists(dataset_path):
        print("Dataset not found. Creating synthetic data for demonstration...")
        # Simple synthetic data structure: N, P, K, temp, hum, ph, rain, label
        data = {
            'N': [90, 85, 60, 70, 80, 40, 50, 20],
            'P': [42, 58, 55, 35, 20, 70, 30, 10],
            'K': [43, 41, 44, 40, 15, 20, 50, 30],
            'temperature': [20.8, 22.6, 25.0, 26.5, 28.0, 30.0, 24.0, 18.0],
            'humidity': [82.0, 80.3, 70.0, 88.0, 50.0, 60.0, 75.0, 90.0],
            'ph': [6.5, 7.0, 5.5, 6.8, 7.2, 6.0, 6.2, 5.0],
            'rainfall': [202.9, 226.6, 150.0, 180.0, 100.0, 80.0, 250.0, 300.0],
            'label': ['rice', 'rice', 'maize', 'maize', 'cotton', 'cotton', 'jute', 'jute']
        }
        df = pd.DataFrame(data)
        df.to_csv(dataset_path, index=False)
    else:
        df = pd.read_csv(dataset_path)

    X = df.drop('label', axis=1)
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save the model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/crop_model.pkl')
    print("Model trained and saved to models/crop_model.pkl")

    # Save feature names for reference
    joblib.dump(list(X.columns), 'models/features.pkl')

if __name__ == "__main__":
    train_model()
