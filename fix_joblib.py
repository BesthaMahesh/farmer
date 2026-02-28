import json
import os

notebook_path = r'ml/cnn_training.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    source_str = ''.join(cell.get('source', []))
    if 'import torch' in source_str and 'Step 2' in source_str:
        if 'import joblib' not in source_str:
            print('  Adding joblib to Step 2...')
            # Add after matplotlib or anywhere sensible
            new_source = []
            for line in cell['source']:
                new_source.append(line)
                if 'import seaborn' in line:
                    new_source.append("import joblib\n")
            cell['source'] = new_source

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=4)

print('Patch applied.')
