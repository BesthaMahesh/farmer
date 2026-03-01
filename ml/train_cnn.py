import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms
from PIL import Image
import pandas as pd
from sklearn.model_selection import train_test_split
from tqdm import tqdm

# Fix for WinError 1114 (DLL load failure) / OpenMP duplicate
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

# Constants
DATASET_DIR = '../dataset/plant-pathology-2020'
TRAIN_CSV = os.path.join(DATASET_DIR, 'train.csv')
IMAGES_DIR = os.path.join(DATASET_DIR, 'images')
MODEL_SAVE_PATH = '../backend/models/cnn_model.pt'
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
BATCH_SIZE = 16
EPOCHS = 5 # Reduced for quick training

class PlantDataset(Dataset):
    def __init__(self, df, transform=None):
        self.df = df
        self.transform = transform
        
    def __len__(self):
        return len(self.df)
        
    def __getitem__(self, idx):
        img_id = self.df.iloc[idx]['image_id']
        path = os.path.join(IMAGES_DIR, f"{img_id}.jpg")
        image = Image.open(path).convert('RGB')
        label = self.df.iloc[idx]['label_idx']
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

def train_model():
    if not os.path.exists(TRAIN_CSV):
        print(f"Dataset not found at {TRAIN_CSV}. Please run kaggle download in notebook first.")
        return

    # Load data
    train_df = pd.read_csv(TRAIN_CSV)
    class_names = ['healthy', 'multiple_diseases', 'rust', 'scab']
    train_df['label'] = train_df[class_names].idxmax(axis=1)
    train_df['label_idx'] = train_df['label'].map({c: i for i, c in enumerate(class_names)})
    
    # Split
    train_data, val_data = train_test_split(train_df, test_size=0.2, random_state=42, stratify=train_df['label_idx'])
    
    # Transforms
    train_trans = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    val_trans = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    # DataLoaders
    train_loader = DataLoader(PlantDataset(train_data, train_trans), batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(PlantDataset(val_data, val_trans), batch_size=BATCH_SIZE)
    
    # Model Setup
    print(f"Initializing MobileNetV2 on {DEVICE}...")
    model = models.mobilenet_v2(pretrained=True)
    for param in model.parameters():
        param.requires_grad = False
        
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.BatchNorm1d(256),
        nn.Dropout(p=0.3),
        nn.Linear(256, 4)
    )
    
    model = model.to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)
    
    # Training Loop
    print("Starting Training (Transfer Learning)...")
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        for images, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}"):
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            
        print(f"Epoch {epoch+1} Loss: {running_loss/len(train_loader):.4f}")
        
    # Save
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    torch.save({
        'model_state_dict': model.state_dict(),
        'class_names': class_names
    }, MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train_model()
