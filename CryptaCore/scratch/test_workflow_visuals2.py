import subprocess
import os
import shutil

artifact_dir = r"C:\Users\USER\.gemini\antigravity-ide\brain\f3d9f965-a67f-4981-ad8b-365a4e9ed5f8"
scratch_dir = r"C:\Users\USER\Downloads\CryptaCore\scratch"
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

with open(r'c:\Users\USER\Downloads\CryptaCore\website\index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# Instant scroll without smooth behavior, executed immediately
dark_script = """
<script>
window.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('theme', 'dark');
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
});
window.addEventListener('load', () => {
    setTimeout(() => {
        const el = document.getElementById('techWorkflow');
        if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
            window.scrollTo(0, y);
        }
    }, 100);
});
</script>
</head>
"""
dark_test_html = orig_html.replace('</head>', dark_script)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\test-workflow-dark.html', 'w', encoding='utf-8') as f:
    f.write(dark_test_html)

dark_out = os.path.join(scratch_dir, "workflow_dark.png")
cmd_dark = [
    edge_exe,
    '--headless=new',
    '--virtual-time-budget=3000',
    '--window-size=1440,1200',
    f'--screenshot={dark_out}',
    'http://localhost:8080/test-workflow-dark.html'
]
subprocess.run(cmd_dark, check=True)
print("Captured Dark Mode Workflow Screenshot with virtual-time-budget")

# Light Mode Test
light_script = """
<script>
window.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('theme', 'light');
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
});
window.addEventListener('load', () => {
    setTimeout(() => {
        const el = document.getElementById('techWorkflow');
        if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
            window.scrollTo(0, y);
            const stage4 = document.querySelector('.tech-stage-node[data-stage="4"]');
            if (stage4) stage4.click();
        }
    }, 100);
});
</script>
</head>
"""
light_test_html = orig_html.replace('</head>', light_script)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\test-workflow-light.html', 'w', encoding='utf-8') as f:
    f.write(light_test_html)

light_out = os.path.join(scratch_dir, "workflow_light.png")
cmd_light = [
    edge_exe,
    '--headless=new',
    '--virtual-time-budget=3000',
    '--window-size=1440,1200',
    f'--screenshot={light_out}',
    'http://localhost:8080/test-workflow-light.html'
]
subprocess.run(cmd_light, check=True)
print("Captured Light Mode Workflow Screenshot with virtual-time-budget")

# Copy to artifacts
for f in ["workflow_dark.png", "workflow_light.png"]:
    src = os.path.join(scratch_dir, f)
    dst = os.path.join(artifact_dir, f)
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {f} to artifacts directory")

# Clean up
for temp_file in ['test-workflow-dark.html', 'test-workflow-light.html']:
    path = os.path.join(r'c:\Users\USER\Downloads\CryptaCore\website', temp_file)
    if os.path.exists(path):
        os.remove(path)
print("Done.")
