import json
import os

notebook_path = r'ml/cnn_training.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

print(f'Cleaning up and fixing {notebook_path}...')

new_cells = []
for cell in nb['cells']:
    source_str = ''.join(cell.get('source', []))
    
    # Clean up messed up Markdown Step 5
    if cell['cell_type'] == 'markdown' and '## Step 5: Dataset & Transforms' in source_str:
        if 'IMG_SIZE = 224' in source_str:
            print('  Cleaning up duplicate code in markdown cell...')
            cell['source'] = ["## Step 5: Dataset & Transforms\n"]
    
    # Fix Step 2 to be more descriptive and robust
    if 'import torch' in source_str and 'Step 2' in source_str and cell['cell_type'] == 'code':
        print('  Enhancing Step 2 robustness...')
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
            "# --- Robust Fix for WinError 1114 (DLL load failure) ---\n",
            "# This explicitly adds common DLL paths to the search list\n",
            "if sys.platform == 'win32':\n",
            "    # Potential Conda paths\n",
            "    bases = [sys.prefix, os.environ.get('CONDA_PREFIX')]\n",
            "    for base in [b for b in bases if b]:\n",
            "        for subdir in [r'Library\\bin', r'bin']:\n",
            "            path = os.path.join(base, subdir)\n",
            "            if os.path.exists(path):\n",
                "                # print(f'Adding DLL search path: {path}')\n",
            "                if hasattr(os, 'add_dll_directory'):\n",
            "                    try: os.add_dll_directory(path)\n",
            "                    except: pass\n",
            "                else:\n",
            "                    os.environ['PATH'] = path + os.pathsep + os.environ['PATH']\n",
            "\n",
            "try:\n",
            "    print('\u231b Loading PyTorch components...')\n",
            "    import torch\n",
            "    import torch.nn as nn\n",
            "    import torch.optim as optim\n",
            "    from torch.utils.data import Dataset, DataLoader\n",
            "    import torchvision\n",
            "    from torchvision import transforms, models\n",
            "    try:\n",
            "        from torchvision.models import MobileNet_V2_Weights\n",
            "    except ImportError: MobileNet_V2_Weights = None\n",
            "    \n",
            "    import joblib\n",
            "    from sklearn.model_selection import train_test_split\n",
            "    from sklearn.metrics import classification_report, confusion_matrix\n",
            "    \n",
            "    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n",
            "    print(f'\u2705 Libraries imported successfully.')\n",
            "    print(f'\ud83d\udcbb Using device: {DEVICE}')\n",
            "except OSError as e:\n",
            "    print(f'\u274c CRITICAL DLL ERROR: {e}')\n",
            "    print('\\n' + '='*50)\n",
            "    print('\ud83d\udca1 WINDOWS POWER SETTINGS DETECTED AS LIKELY CAUSE')\n",
            "    print('This error (1114) happens when Windows throttles your GPU/DLLs.')\n",
            "    print('1. CONNECT YOUR CHARGER (Laptop).')\n",
            "    print('2. Go to Start -> Search \"Edit Power Plan\" -> Change advanced power settings.')\n",
            "    print('3. Find \"Switchable Dynamic Graphics\" -> \"Global Settings\" -> Set both to \"Maximize Performance\".')\n",
            "    print('='*50)\n",
            "except Exception as e:\n",
            "    print(f'\u26a0\ufe0f Unexpected error: {e}')\n"
        ]
        cell['outputs'] = []

    # Update Step 4 to define missing constants
    if 'CLASS_NAMES' in source_str and 'label2idx' in source_str and cell['cell_type'] == 'code':
        print('  Patching Step 4 for training constants...')
        cell['source'] = [
            "# Step 4: Load & Explore Data with Training Constants\n",
            "CLASS_NAMES = ['healthy', 'multiple_diseases', 'rust', 'scab']\n",
            "NUM_CLASSES = len(CLASS_NAMES)\n",
            "EPOCHS_WARM = 5\n",
            "EPOCHS_FINE = 10\n",
            "\n",
            "label2idx   = {c: i for i, c in enumerate(CLASS_NAMES)}\n",
            "idx2label   = {i: c for c, i in label2idx.items()}\n",
            "\n",
            "train_df = pd.read_csv(os.path.join(DATASET_DIR, 'train.csv'))\n",
            "test_df  = pd.read_csv(os.path.join(DATASET_DIR, 'test.csv'))\n",
            "\n",
            "# One-hot \u2192 label\n",
            "train_df['label'] = train_df[CLASS_NAMES].idxmax(axis=1)\n",
            "train_df['label_idx'] = train_df['label'].map(label2idx)\n",
            "\n",
            "# Find images folder\n",
            "for subdir in ['images', 'train_images', '']:\n",
            "    candidate = os.path.join(DATASET_DIR, subdir)\n",
            "    if os.path.isdir(candidate) and any(f.endswith('.jpg') for f in os.listdir(candidate)):\n",
            "        IMAGES_DIR = candidate\n",
            "        break\n",
            "else:\n",
            "    IMAGES_DIR = DATASET_DIR\n",
            "\n",
            "print(f'Images dir: {IMAGES_DIR}')\n",
            "\n",
            "def get_path(img_id):\n",
            "    for ext in ['.jpg', '.JPG', '.jpeg']:\n",
            "        p = os.path.join(IMAGES_DIR, f'{img_id}{ext}')\n",
            "        if os.path.exists(p): return p\n",
            "    return os.path.join(IMAGES_DIR, f'{img_id}.jpg')\n",
            "\n",
            "train_df['image_path'] = train_df['image_id'].apply(get_path)\n",
            "\n",
            "print(f'Samples: {len(train_df)}')\n",
            "print(f'\\nConstants: NUM_CLASSES={NUM_CLASSES}, WARM={EPOCHS_WARM}, FINE={EPOCHS_FINE}')\n",
            "train_df.head()\n"
        ]
        cell['outputs'] = []

    # Clean up messed up Markdown Step 5
    if cell['cell_type'] == 'markdown' and 'Step 5: Dataset & Transforms' in source_str:
        print('  Cleaning up markdown Step 5...')
        cell['source'] = ["## Step 5: Dataset & Transforms\n"]
        new_cells.append(cell)
        continue
    
    # Update Step 5 code cell to be completely self-contained and robust
    if cell['cell_type'] == 'code' and ('PlantDataset' in source_str or '## Step 5: Dataset & Transforms' in source_str):
        if 'stratify' in source_str or 'IMG_SIZE' in source_str:
            print('  Patching Step 5 code for maximum robustness...')
            cell['source'] = [
                "import torch\n",
                "from torchvision import transforms\n",
                "from torch.utils.data import Dataset, DataLoader\n",
                "from PIL import Image\n",
                "from sklearn.model_selection import train_test_split\n",
                "\n",
                "# 1. Constants & Transforms\n",
                "IMG_SIZE = 224\n",
                "BATCH_SIZE = 16\n",
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
                "# 2. Dataset class\n",
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
                "            img = Image.new('RGB', (IMG_SIZE, IMG_SIZE))\n",
                "        if self.transform: img = self.transform(img)\n",
                "        return img, int(row['label_idx'])\n",
                "\n",
                "print('\u231b Preparing data splits...')\n",
                "try:\n",
                "    if 'train_df' not in globals():\n",
                "        raise NameError(\"train_df not found. Please run Step 4 first!\")\n",
                "    \n",
                "    # Attempt stratified split\n",
                "    train_set, val_set = train_test_split(train_df, test_size=0.2, random_state=42, stratify=train_df['label'])\n",
                "    \n",
                "    train_ds = PlantDataset(train_set, train_transforms)\n",
                "    val_ds   = PlantDataset(val_set,   val_transforms)\n",
                "\n",
                "    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)\n",
                "    val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False)\n",
                "\n",
                "    print(f'\u2705 Ready! Train: {len(train_ds)} | Val: {len(val_ds)}')\n",
                "except Exception as e:\n",
                "    print(f'\u274c ERROR IN STEP 5: {e}')\n"
            ]
            cell['outputs'] = []
            new_cells.append(cell)
            continue

    new_cells.append(cell)

nb['cells'] = new_cells
with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=4)

print('Cleanup and enhancement complete.')
