import json
import os

notebook_path = r'ml/cnn_training.ipynb'

if not os.path.exists(notebook_path):
    print(f'Error: {notebook_path} not found.')
    exit(1)

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

print(f'Patching {notebook_path}...')

for cell in nb['cells']:
    # Fix Step 2 (Imports & DLL)
    source_str = ''.join(cell.get('source', []))
    if 'import torch' in source_str and 'Step 2' in source_str:
        print('  Patching Step 2...')
        cell['source'] = [
            "# Step 2: Import Libraries with DLL error handling\n",
            "import os, sys, warnings\n",
            "import pandas as pd\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "from PIL import Image\n",
            "from tqdm.auto import tqdm\n",
            "\n",
            "# --- Fix for WinError 1114 (DLL load failure) ---\n",
            "conda_path = os.environ.get('CONDA_PREFIX')\n",
            "if conda_path:\n",
            "    dll_dir = os.path.join(conda_path, 'Library', 'bin')\n",
            "    if os.path.exists(dll_dir):\n",
            "        if hasattr(os, 'add_dll_directory'):\n",
            "            os.add_dll_directory(dll_dir)\n",
            "        else:\n",
            "            os.environ['PATH'] = dll_dir + os.pathsep + os.environ['PATH']\n",
            "\n",
            "try:\n",
            "    import torch\n",
            "    import torch.nn as nn\n",
            "    import torch.optim as optim\n",
            "    from torch.utils.data import Dataset, DataLoader\n",
            "    from torchvision import transforms, models\n",
            "    try:\n",
            "        from torchvision.models import MobileNet_V2_Weights\n",
            "    except ImportError: MobileNet_V2_Weights = None\n",
            "    \n",
            "    from sklearn.model_selection import train_test_split\n",
            "    from sklearn.metrics import classification_report, confusion_matrix\n",
            "    \n",
            "    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n",
            "    print(f'\u2705 Libraries imported successfully.')\n",
            "    print(f'\ud83d\udcbb Using device: {DEVICE}')\n",
            "except OSError as e:\n",
            "    print(f'\u274c OSError during import: {e}')\n",
            "    print('\ud83d\udca1 TIP: WinError 1114 often means your Laptop is in \"Power Saving\" mode.')\n",
            "    print('      Try connecting to power or changing \"Switchable Dynamic Graphics\" in Windows settings.')\n",
            "except Exception as e:\n",
            "    print(f'\u26a0\ufe0f Unexpected error: {e}')\n"
        ]
        cell['outputs'] = []

    # Fix Step 5 (Dataset & Transforms)
    if 'Step 5: Dataset & Transforms' in source_str or ( 'PlantDataset' in source_str and 'stratify' in source_str):
        print('  Patching Step 5...')
        cell['source'] = [
            "## Step 5: Dataset & Transforms\n",
            "IMG_SIZE = 224\n",
            "BATCH_SIZE = 16\n",
            "\n",
            "MEAN, STD = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]\n",
            "\n",
            "train_transforms = transforms.Compose([\n",
            "    transforms.Resize((IMG_SIZE, IMG_SIZE)),\n",
            "    transforms.RandomHorizontalFlip(),\n",
            "    transforms.RandomRotation(15),\n",
            "    transforms.ColorJitter(0.1, 0.1, 0.1),\n",
            "    transforms.ToTensor(),\n",
            "    transforms.Normalize(MEAN, STD)\n",
            "])\n",
            "\n",
            "val_transforms = transforms.Compose([\n",
            "    transforms.Resize((IMG_SIZE, IMG_SIZE)),\n",
            "    transforms.ToTensor(),\n",
            "    transforms.Normalize(MEAN, STD)\n",
            "])\n",
            "\n",
            "class PlantDataset(Dataset):\n",
            "    def __init__(self, df, transform=None):\n",
            "        self.df = df.reset_index(drop=True)\n",
            "        self.transform = transform\n",
            "    def __len__(self): return len(self.df)\n",
            "    def __getitem__(self, idx):\n",
            "        row = self.df.iloc[idx]\n",
            "        try:\n",
            "            img = Image.open(row['image_path']).convert('RGB')\n",
            "        except Exception as e:\n",
            "            print(f'Error loading {row.get(\"image_id\")}: {e}')\n",
            "            img = Image.new('RGB', (IMG_SIZE, IMG_SIZE))\n",
            "        if self.transform: img = self.transform(img)\n",
            "        return img, int(row['label_idx'])\n",
            "\n",
            "print('\u231b Splitting data...')\n",
            "try:\n",
            "    # Attempt stratified split (better for balanced validation)\n",
            "    train_set, val_set = train_test_split(train_df, test_size=0.2, random_state=42, stratify=train_df['label'])\n",
            "except Exception as e:\n",
            "    print(f'\u26a0\ufe0f Stratified split failed ({e}). Falling back to simple split.')\n",
            "    train_set, val_set = train_test_split(train_df, test_size=0.2, random_state=42)\n",
            "\n",
            "train_ds = PlantDataset(train_set, train_transforms)\n",
            "val_ds   = PlantDataset(val_set,   val_transforms)\n",
            "\n",
            "train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)\n",
            "val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False)\n",
            "\n",
            "print(f'\u2705 Ready! Train: {len(train_ds)} | Val: {len(val_ds)}')\n"
        ]

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=4)

print('Patching complete.')
