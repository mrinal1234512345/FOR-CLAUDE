import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

raw_classes = re.findall(r'class=["\']([^"\']+)["\']', html)
all_classes = set()
for c in raw_classes:
    for item in c.split():
        all_classes.add(item)

missing = []
present = []
for c in sorted(all_classes):
    if c.startswith('fa') or c in ['active', 'show', 'valid', 'invalid']:
        continue
    if f'.{c}' in css:
        present.append(c)
    else:
        missing.append(c)

print(f"Total HTML classes: {len(all_classes)}")
print(f"Present: {len(present)}")
print(f"Missing in CSS: {len(missing)}")
print("--- Missing Classes ---")
for m in missing:
    print(f"  .{m}")
