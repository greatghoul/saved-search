import json
import os
import zipfile

with open('app/_locales/en/messages.json', encoding='utf-8') as f:
    messages = json.load(f)
extension_name = messages['appName']['message']

with open('app/manifest.json', encoding='utf-8') as f:
    manifest = json.load(f)
version = manifest['version']

os.makedirs('dist', exist_ok=True)
zip_filename = f"dist/{extension_name} {version}.zip"

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('app'):
        for file in files:
            filepath = os.path.join(root, file)
            arcname = os.path.relpath(filepath, 'app')
            zipf.write(filepath, arcname)

print(f"Packed as {zip_filename}")
