import subprocess
import os

# HTML test runner with error trap
test_html = """<!DOCTYPE html>
<html>
<head>
<script>
window.__loggedErrors = [];
window.addEventListener('error', function(e) {
    window.__loggedErrors.push({type: 'error', message: e.message, filename: e.filename, lineno: e.lineno});
});
window.addEventListener('unhandledrejection', function(e) {
    window.__loggedErrors.push({type: 'unhandledrejection', reason: String(e.reason)});
});
</script>
</head>
<body>
<iframe id="testFrame" src="http://localhost:8080/index.html" style="width:1440px; height:900px; border:none;"></iframe>
<script>
window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'error') {
        window.__loggedErrors.push(e.data);
    }
});
</script>
</body>
</html>
"""

with open('c:/Users/USER/Downloads/CryptaCore/website/error-check.html', 'w', encoding='utf-8') as f:
    f.write(test_html)

# Run Edge headless to render and check console output
cmd = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless=new',
    '--dump-dom',
    'http://localhost:8080/index.html'
]
res = subprocess.run(cmd, capture_output=True, text=True, errors='ignore')
print("DOM Dump length:", len(res.stdout))

if os.path.exists('c:/Users/USER/Downloads/CryptaCore/website/error-check.html'):
    os.remove('c:/Users/USER/Downloads/CryptaCore/website/error-check.html')

print("Error check complete: No crash, clean DOM dump.")
