import subprocess

with open('c:/Users/USER/Downloads/CryptaCore/website/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

inject = "<script>localStorage.setItem('theme', 'light');</script></head>"
light_content = content.replace('</head>', inject)
with open('c:/Users/USER/Downloads/CryptaCore/website/light-index.html', 'w', encoding='utf-8') as f:
    f.write(light_content)

cmd = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless=new',
    '--window-size=1440,10000',
    '--screenshot=C:\\Users\\USER\\Downloads\\CryptaCore\\scratch\\light_full_10000.png',
    'http://localhost:8080/light-index.html'
]
subprocess.run(cmd, check=True)
print('Screenshot taken: light_full_10000.png')




