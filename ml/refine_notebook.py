import json
import os

path = r'C:\Users\mahes\OneDrive\ドキュメント\farmer\ml\cnn_training.ipynb'

if not os.path.exists(path):
    print(f'Error: File not found at {path}')
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    # Step 6: Robust Model Building
    if cell.get('id') == 'build_model':
        cell['source'] = [
            "def build_mobilenetv2(num_classes=4, freeze=True):\n",
            "    # Load pretrained MobileNetV2\n",
            "    if MobileNet_V2_Weights:\n",
            "        print('🚀 Loading MobileNetV2 with weights=MobileNet_V2_Weights.DEFAULT')\n",
            "        model = models.mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)\n",
            "    else:\n",
            "        print('🚀 Loading MobileNetV2 with pretrained=True (legacy mode)')\n",
            "        model = models.mobilenet_v2(pretrained=True)\n",
            "\n",
            "    if freeze:\n",
            "        for param in model.features.parameters():\n",
            "            param.requires_grad = False\n",
            "\n",
            "    # Replace classifier\n",
            "    in_features = model.classifier[1].in_features\n",
            "    model.classifier = nn.Sequential(\n",
            "        nn.Dropout(p=0.4),\n",
            "        nn.Linear(in_features, 256),\n",
            "        nn.ReLU(),\n",
            "        nn.BatchNorm1d(256),\n",
            "        nn.Dropout(p=0.3),\n",
            "        nn.Linear(256, num_classes)\n",
            "    )\n",
            "    return model\n",
            "\n",
            "model = build_mobilenetv2(NUM_CLASSES, freeze=True).to(DEVICE)\n",
            "\n",
            "total_params = sum(p.numel() for p in model.parameters())\n",
            "train_params = sum(p.numel() for p in model.parameters() if p.requires_grad)\n",
            "print(f'Total params:     {total_params:,}')\n",
            "print(f'Trainable params: {train_params:,} (head only, base frozen)')\n",
            "print(f'Model on: {DEVICE}')"
        ]

    # Step 11: Robust Save
    if cell.get('id') == 'save_model':
        cell['source'] = [
            "# Ensure directory exists\n",
            "SAVE_DIR = '../backend/models'\n",
            "os.makedirs(SAVE_DIR, exist_ok=True)\n",
            "\n",
            "# Save full model (PyTorch format)\n",
            "save_path = os.path.join(SAVE_DIR, 'cnn_model.pt')\n",
            "torch.save({\n",
            "    'model_state_dict': model.state_dict(),\n",
            "    'class_names': CLASS_NAMES,\n",
            "    'label2idx': label2idx,\n",
            "    'idx2label': idx2label,\n",
            "    'img_size': IMG_SIZE,\n",
            "    'best_val_acc': best_val_acc\n",
            "}, save_path)\n",
            "\n",
            "joblib.dump(CLASS_NAMES, os.path.join(SAVE_DIR, 'cnn_classes.pkl'))\n",
            "\n",
            "print(f'✅ Model saved to {os.path.abspath(SAVE_DIR)}')\n",
            "print(f'   cnn_model.pt   ← Full PyTorch model')\n",
            "print(f'   cnn_best.pt    \u2190 Best checkpoint')\n",
            "print(f'   cnn_classes.pkl \u2190 Class names list')\n",
            "print(f'\\n\ud83c\udfc6 Best Val Accuracy: {best_val_acc*100:.2f}%')\n",
            "print(f'\ud83d\udccb Classes: {CLASS_NAMES}')"
        ]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=4)

print('Successfully refined remaining steps in cnn_training.ipynb')
