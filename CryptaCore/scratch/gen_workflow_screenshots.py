import subprocess
import os
import shutil

artifact_dir = r"C:\Users\USER\.gemini\antigravity-ide\brain\f3d9f965-a67f-4981-ad8b-365a4e9ed5f8"
scratch_dir = r"C:\Users\USER\Downloads\CryptaCore\scratch"
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Extract just the container with techWorkflow or inject a tiny CSS that scrolls/positions techWorkflow at top
with open(r'c:\Users\USER\Downloads\CryptaCore\website\index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# For Dark Mode
inject_dark = """
<style>
/* Position techWorkflow at top for screenshot capture */
#home, #problem, #solution, .steps-grid, .navbar, .section-kicker, .how-it-works > .container > h2, .how-it-works > .container > .section-subtitle {
    display: none !important;
}
.how-it-works {
    padding-top: 1.5rem !important;
}
</style>
<script>
localStorage.setItem('theme', 'dark');
</script>
</head>
"""
dark_html = orig_html.replace('</head>', inject_dark)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\preview-workflow-dark.html', 'w', encoding='utf-8') as f:
    f.write(dark_html)

dark_out = os.path.join(scratch_dir, "workflow_dark_clean.png")
cmd_dark = [
    edge_exe,
    '--headless=new',
    '--window-size=1440,950',
    f'--screenshot={dark_out}',
    'http://localhost:8080/preview-workflow-dark.html'
]
subprocess.run(cmd_dark, check=True)
print("Captured clean Dark Mode workflow screenshot")

# For Light Mode with Stage 4 Active
inject_light = """
<style>
#home, #problem, #solution, .steps-grid, .navbar, .section-kicker, .how-it-works > .container > h2, .how-it-works > .container > .section-subtitle {
    display: none !important;
}
.how-it-works {
    padding-top: 1.5rem !important;
}
</style>
<script>
localStorage.setItem('theme', 'light');
window.addEventListener('load', () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    setTimeout(() => {
        const s = document.querySelector('.tech-stage-node[data-stage="4"]');
        if (s) s.click();
    }, 100);
});
</script>
</head>
"""
light_html = orig_html.replace('</head>', inject_light)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\preview-workflow-light.html', 'w', encoding='utf-8') as f:
    f.write(light_html)

light_out = os.path.join(scratch_dir, "workflow_light_clean.png")
cmd_light = [
    edge_exe,
    '--headless=new',
    '--window-size=1440,950',
    f'--screenshot={light_out}',
    'http://localhost:8080/preview-workflow-light.html'
]
subprocess.run(cmd_light, check=True)
print("Captured clean Light Mode workflow screenshot")

# Copy to artifacts
for f in ["workflow_dark_clean.png", "workflow_light_clean.png"]:
    src = os.path.join(scratch_dir, f)
    dst = os.path.join(artifact_dir, f)
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {f} to artifacts directory")

# Cleanup
for temp_file in ['preview-workflow-dark.html', 'preview-workflow-light.html']:
    p = os.path.join(r'c:\Users\USER\Downloads\CryptaCore\website', temp_file)
    if os.path.exists(p):
        os.remove(p)
