import re

with open(r'C:\Users\Ali\Desktop\Tradeza.in\code.html', encoding='utf-8', errors='ignore') as f:
    s = f.read()

seen = set()
for m in re.finditer(r'href=["\']([^"\']+)["\']', s):
    l = m.group(1)
    if l.startswith('/') and not l.startswith('//'):
        p = l.split('?')[0].split('#')[0]
        seen.add(p)

for p in sorted(seen):
    print(p)
