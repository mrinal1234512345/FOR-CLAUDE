import subprocess
import time
import os

os.makedirs('c:/Users/USER/Downloads/CryptaCore/scratch', exist_ok=True)

# 1. Dark Mode Screenshot
cmd_dark = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless=new',
    '--window-size=1440,1150',
    '--screenshot=C:\\Users\\USER\\Downloads\\CryptaCore\\scratch\\at_dark_hero.png',
    'http://localhost:8080/index.html'
]
subprocess.run(cmd_dark, check=True)
print('Captured at_dark_hero.png')

# 2. Light Mode Setup & Screenshot
with open('c:/Users/USER/Downloads/CryptaCore/website/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

inject = "<script>localStorage.setItem('theme', 'light');</script></head>"
light_content = content.replace('</head>', inject)
with open('c:/Users/USER/Downloads/CryptaCore/website/test-at-light.html', 'w', encoding='utf-8') as f:
    f.write(light_content)

cmd_light = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless=new',
    '--window-size=1440,1150',
    '--screenshot=C:\\Users\\USER\\Downloads\\CryptaCore\\scratch\\at_light_hero.png',
    'http://localhost:8080/test-at-light.html'
]
subprocess.run(cmd_light, check=True)
print('Captured at_light_hero.png')

# 3. Clean up temporary test file
if os.path.exists('c:/Users/USER/Downloads/CryptaCore/website/test-at-light.html'):
    os.remove('c:/Users/USER/Downloads/CryptaCore/website/test-at-light.html')
print('Cleaned up temp test file')
