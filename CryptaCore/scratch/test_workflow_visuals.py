import subprocess
import os
import shutil

artifact_dir = r"C:\Users\USER\.gemini\antigravity-ide\brain\f3d9f965-a67f-4981-ad8b-365a4e9ed5f8"
scratch_dir = r"C:\Users\USER\Downloads\CryptaCore\scratch"
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# 1. Dark Mode Workflow Test File
with open(r'c:\Users\USER\Downloads\CryptaCore\website\index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# Inject auto-scroll to techWorkflow and set dark theme
dark_script = """
<script>
window.addEventListener('load', () => {
    localStorage.setItem('theme', 'dark');
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    const el = document.getElementById('techWorkflow');
    if (el) {
        el.scrollIntoView({ block: 'start' });
    }
});
</script>
</head>
"""
dark_test_html = orig_html.replace('</head>', dark_script)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\test-workflow-dark.html', 'w', encoding='utf-8') as f:
    f.write(dark_test_html)

# Capture Dark Mode Screenshot
dark_out = os.path.join(scratch_dir, "workflow_dark.png")
cmd_dark = [
    edge_exe,
    '--headless=new',
    '--window-size=1440,1100',
    f'--screenshot={dark_out}',
    'http://localhost:8080/test-workflow-dark.html'
]
subprocess.run(cmd_dark, check=True)
print("Captured Dark Mode Workflow Screenshot")

# 2. Light Mode Workflow Test File
light_script = """
<script>
window.addEventListener('load', () => {
    localStorage.setItem('theme', 'light');
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    const el = document.getElementById('techWorkflow');
    if (el) {
        el.scrollIntoView({ block: 'start' });
    }
});
</script>
</head>
"""
light_test_html = orig_html.replace('</head>', light_script)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\test-workflow-light.html', 'w', encoding='utf-8') as f:
    f.write(light_test_html)

# Capture Light Mode Screenshot
light_out = os.path.join(scratch_dir, "workflow_light.png")
cmd_light = [
    edge_exe,
    '--headless=new',
    '--window-size=1440,1100',
    f'--screenshot={light_out}',
    'http://localhost:8080/test-workflow-light.html'
]
subprocess.run(cmd_light, check=True)
print("Captured Light Mode Workflow Screenshot")

# 3. Interactive Stage 4 Test in Dark Mode (Simulate click on Stage 4 Smart Contract)
interactive_script = """
<script>
window.addEventListener('load', () => {
    localStorage.setItem('theme', 'dark');
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    const el = document.getElementById('techWorkflow');
    if (el) {
        el.scrollIntoView({ block: 'start' });
    }
    setTimeout(() => {
        const stage4 = document.querySelector('.tech-stage-node[data-stage="4"]');
        if (stage4) stage4.click();
    }, 200);
});
</script>
</head>
"""
stage4_test_html = orig_html.replace('</head>', interactive_script)
with open(r'c:\Users\USER\Downloads\CryptaCore\website\test-workflow-stage4.html', 'w', encoding='utf-8') as f:
    f.write(stage4_test_html)

stage4_out = os.path.join(scratch_dir, "workflow_stage4_dark.png")
cmd_stage4 = [
    edge_exe,
    '--headless=new',
    '--window-size=1440,1100',
    f'--screenshot={stage4_out}',
    'http://localhost:8080/test-workflow-stage4.html'
]
subprocess.run(cmd_stage4, check=True)
print("Captured Stage 4 Interactive Screenshot")

# Copy to artifacts directory
for f in ["workflow_dark.png", "workflow_light.png", "workflow_stage4_dark.png"]:
    src = os.path.join(scratch_dir, f)
    dst = os.path.join(artifact_dir, f)
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {f} to artifacts directory")

# Cleanup temporary files
for temp_file in ['test-workflow-dark.html', 'test-workflow-light.html', 'test-workflow-stage4.html']:
    path = os.path.join(r'c:\Users\USER\Downloads\CryptaCore\website', temp_file)
    if os.path.exists(path):
        os.remove(path)
print("Cleaned up temporary test files.")
