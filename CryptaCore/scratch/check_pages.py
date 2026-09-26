import subprocess

for page in ['verify', 'admin']:
    with open(f'website/{page}.html', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('</head>', '<script>localStorage.setItem("theme", "light");</script></head>')
    with open(f'website/test-{page}.html', 'w', encoding='utf-8') as f:
        f.write(c)
    
    cmd = [
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless=new',
        '--window-size=1440,1200',
        f'--screenshot=C:\\Users\\USER\\Downloads\\CryptaCore\\scratch\\test_{page}_light_fixed.png',
        f'http://localhost:8080/test-{page}.html'
    ]
    subprocess.run(cmd, check=True)
    print(f'Captured test_{page}_light_fixed.png')

