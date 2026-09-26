import subprocess
import os
import shutil
import time

artifact_dir = r"C:\Users\USER\.gemini\antigravity-ide\brain\f3d9f965-a67f-4981-ad8b-365a4e9ed5f8"
scratch_dir = r"C:\Users\USER\Downloads\CryptaCore\scratch"
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

with open(r'c:\Users\USER\Downloads\CryptaCore\website\index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# 1. Dark Mode Test Preview HTML (Scroll to AI Assistant and trigger question)
inject_dark = """
<style>
#home, #problem, #solution, #how-it-works, #features, #benefits, #demo, .navbar {
    display: none !important;
}
.ai-assistant {
    padding-top: 2rem !important;
}
</style>
<script>
window.__instantTypewriter = true;
localStorage.setItem('theme', 'dark');
window.addEventListener('load', () => {
    const input = document.getElementById('aiUserInput');
    const form = document.getElementById('aiChatForm');
    if (input && form) {
        input.value = "How does instant document verification work?";
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
});
</script>
</head>
"""
dark_html = orig_html.replace('</head>', inject_dark)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\preview-ai-dark.html', 'w', encoding='utf-8') as f:
    f.write(dark_html)

time.sleep(0.2)
dark_out = os.path.join(scratch_dir, "ai_assistant_dark.png")
cmd_dark = [
    edge_exe,
    '--headless=new',
    '--virtual-time-budget=2000',
    '--window-size=1440,1100',
    f'--screenshot={dark_out}',
    'http://localhost:8080/preview-ai-dark.html'
]
subprocess.run(cmd_dark, check=True)
print("Captured AI Assistant Dark Mode Screenshot")

# 2. Light Mode Test Preview HTML (Trigger a different question)
inject_light = """
<style>
#home, #problem, #solution, #how-it-works, #features, #benefits, #demo, .navbar {
    display: none !important;
}
.ai-assistant {
    padding-top: 2rem !important;
}
</style>
<script>
window.__instantTypewriter = true;
localStorage.setItem('theme', 'light');
window.addEventListener('load', () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    const input = document.getElementById('aiUserInput');
    const form = document.getElementById('aiChatForm');
    if (input && form) {
        input.value = "Is my document data kept private or uploaded unhashed?";
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
});
</script>
</head>
"""
light_html = orig_html.replace('</head>', inject_light)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\preview-ai-light.html', 'w', encoding='utf-8') as f:
    f.write(light_html)

time.sleep(0.2)
light_out = os.path.join(scratch_dir, "ai_assistant_light.png")
cmd_light = [
    edge_exe,
    '--headless=new',
    '--virtual-time-budget=2000',
    '--window-size=1440,1100',
    f'--screenshot={light_out}',
    'http://localhost:8080/preview-ai-light.html'
]
subprocess.run(cmd_light, check=True)
print("Captured AI Assistant Light Mode Screenshot")

# Copy to artifacts directory
for f in ["ai_assistant_dark.png", "ai_assistant_light.png"]:
    src = os.path.join(scratch_dir, f)
    dst = os.path.join(artifact_dir, f)
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {f} to artifacts directory")

# Clean up
for temp_file in ['preview-ai-dark.html', 'preview-ai-light.html']:
    p = os.path.join(r'c:\Users\USER\Downloads\CryptaCore\website', temp_file)
    if os.path.exists(p):
        os.remove(p)
print("Test completed successfully.")
