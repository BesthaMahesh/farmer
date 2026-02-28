import json
import os

path = r'C:\Users\mahes\OneDrive\ドキュメント\farmer\ml\cnn_training.ipynb'

if not os.path.exists(path):
    print(f'Error: File not found at {path}')
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell.get('id') == 'imports':
        cell['source'] = [
            "# Fix for WinError 1114 (DLL load failure) common on Windows\n",
            "import os, sys, zipfile, warnings\n",
            "os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'\n",
            "\n",
            "import numpy as np\n",
            "import pandas as pd\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "from PIL import Image\n",
            "from tqdm import tqdm\n",
            "import joblib\n",
            "import subprocess  # Needed for Step 3\n",
            "warnings.filterwarnings('ignore')\n",
            "\n",
            "try:\n",
            "    # PyTorch\n",
            "    import torch\n",
            "    import torch.nn as nn\n",
            "    import torch.optim as optim\n",
            "    from torch.utils.data import Dataset, DataLoader\n",
            "    from torchvision import models, transforms\n",
            "    \n",
            "    # Weight access (torchvision >= 0.13.0)\n",
            "    try:\n",
            "        from torchvision.models import MobileNet_V2_Weights\n",
            "    except ImportError:\n",
            "        print('⚠️ MobileNet_V2_Weights not found. Using legacy weights access.')\n",
            "        MobileNet_V2_Weights = None\n",
            "\n",
            "    # Sklearn\n",
            "    from sklearn.model_selection import train_test_split\n",
            "    from sklearn.metrics import classification_report, confusion_matrix\n",
            "\n",
            "    # Device\n",
            "    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n",
            "\n",
            "    print(f'Python:  {sys.version}')\n",
            "    print(f'PyTorch: {torch.__version__}')\n",
            "    print(f'Device:  {DEVICE}')\n",
            "    print('✅ All imports successful!')\n",
            "except Exception as e:\n",
            "    print(f'❌ Error during import: {e}')\n",
            "    print('👉 Did you run Step 1? If yes, try RESTARTING THE KERNEL (Kernel -> Restart).')\n",
            "    if 'WinError 1114' in str(e):\n",
            "        print('💡 DLL Load Error (1114) detected. This is a system-level issue often linked to PyTorch/Anaconda dependencies.')"
        ]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=4)

print('Successfully updated cnn_training.ipynb with DLL fix')
