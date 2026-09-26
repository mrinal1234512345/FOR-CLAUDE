import os
import re

base_dir = r"c:\Users\USER\Downloads\CryptaCore\website"
html_files = [f for f in os.listdir(base_dir) if f.endswith('.html')]
print("Found HTML files:", html_files)

for hf in html_files:
    file_path = os.path.join(base_dir, hf)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    srcs = re.findall(r'src=["\']([^"\']+)["\']', content)
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
    
    print(f"\n=== Checking {hf} ===")
    missing_count = 0
    for s in srcs:
        if not s.startswith(('http://', 'https://', 'data:', '#')):
            clean = s.split('?')[0].split('#')[0]
            target = os.path.join(base_dir, clean)
            if not os.path.exists(target):
                print(f"  [MISSING SRC]: {s} -> {target}")
                missing_count += 1
            else:
                print(f"  [OK SRC]: {s}")
                
    for h in hrefs:
        if not h.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:')):
            clean = h.split('?')[0].split('#')[0]
            if clean:
                target = os.path.join(base_dir, clean)
                if not os.path.exists(target):
                    print(f"  [MISSING HREF]: {h} -> {target}")
                    missing_count += 1
                else:
                    print(f"  [OK HREF]: {h}")

    if missing_count == 0:
        print(f"  All local references in {hf} exist!")
