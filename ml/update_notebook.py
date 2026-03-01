import json
import os

path = r'C:\Users\mahes\OneDrive\ドキュメント\farmer\ml\cnn_training.ipynb'

if not os.path.exists(path):
    print(f'Error: File not found at {path}')
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

new_imports_source = [
    "import os, sys, zipfile, warnings\n",
    "\n",
    "# 1. Critical DLL fix for Windows\n",
    "if sys.platform == 'win32':\n",
    "    dll_dir = os.path.join(sys.prefix, 'Library', 'bin')\n",
    "    if os.path.exists(dll_dir):\n",
    "        if hasattr(os, 'add_dll_directory'):\n",
    "            os.add_dll_directory(dll_dir)\n",
    "        else:\n",
    "            os.environ['PATH'] = dll_dir + os.pathsep + os.environ['PATH']\n",
    "\n",
    "os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'\n",
    "warnings.filterwarnings('ignore')\n",
    "\n",
    "print('--- Diagnostic Check ---')\n",
    "print(f'Python executable: {sys.executable}')\n",
    "print(f'Python version:    {sys.version}')\n",
    "\n",
    "try:\n",
    "    import numpy as np\n",
    "    import pandas as pd\n",
    "    import matplotlib.pyplot as plt\n",
    "    import seaborn as sns\n",
    "    from PIL import Image\n",
    "    import joblib\n",
    "    import subprocess\n",
    "    print('\u2705 Basic libraries imported.')\n",
    "except Exception as e:\n",
    "    print(f'\u274c Basic library error: {e}')\n",
    "\n",
    "try:\n",
    "    import torch\n",
    "    import torch.nn as nn\n",
    "    import torch.optim as optim\n",
    "    from torch.utils.data import Dataset, DataLoader\n",
    "    import torchvision\n",
    "    from torchvision import models, transforms\n",
    "    \n",
    "    # Explicit check for transforms\n",
    "    if 'transforms' in locals() or 'transforms' in globals():\n",
    "        print('\u2705 torchvision.transforms is defined globally.')\n",
    "    else:\n",
    "        # Try forced global definition\n",
    "        globals()['transforms'] = transforms\n",
    "        print('\u26a0\ufe0f transforms was not global, forced it.')\n",
    "\n",
    "    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n",
    "    print(f'\u2705 PyTorch: {torch.__version__} | Device: {DEVICE}')\n",
    "    \n",
    "    try:\n",
    "        from torchvision.models import MobileNet_V2_Weights\n",
    "        print('\u2705 MobileNet_V2_Weights ready.')\n",
    "    except ImportError:\n",
    "        MobileNet_V2_Weights = None\n",
    "        print('\u26a0\ufe0f MobileNet_V2_Weights missing (using legacy).')\n",
    "\n",
    "    from sklearn.model_selection import train_test_split\n",
    "    from sklearn.metrics import classification_report, confusion_matrix\n",
    "    print('\u2705 Scikit-learn imported.')\n",
    "    \n",
    "    print('\\n\u2705 ALL IMPORTS SUCCESSFUL!')\n",
    "except Exception as e:\n",
    "    print(f'\\n\u274c PYTORCH IMPORT ERROR: {e}')\n",
    "    if 'WinError 1114' in str(e):\n",
    "        print('💡 DLL Load Error (1114) detected. This is a common issue on Windows with Anaconda.')\n",
    "        print('👉 Please RESTART THE KERNEL (Kernel -> Restart) and run Step 1 then Step 2 again.')"
]

updated = False
for cell in nb['cells']:
    if cell.get('id') == 'imports':
        cell['source'] = new_imports_source
        updated = True
        break

if updated:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=4)
    print('Successfully updated imports cell with robust version.')
else:
    print('Error: Could not find cell with id "imports"')
