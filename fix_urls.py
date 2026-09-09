import pathlib
import re

files = sorted(pathlib.Path('.').glob('*.html'))
for html in files:
    text = html.read_text(encoding='utf-8')
    new = text
    new = re.sub(r'href=\"([^\"]+?)\.html\"', r'href=\"\1\"', new)
    new = re.sub(r'url=\"([^\"]+?)\.html\"', r'url=\"\1\"', new)
    new = re.sub(r'https://kayobulgaria\.bg/([^\"]+?)\.html', r'https://kayobulgaria.bg/\1', new)
    new = re.sub(r'https://kayobulgaria\.com/([^\"]+?)\.html', r'https://kayobulgaria.com/\1', new)
    if new != text:
        html.write_text(new, encoding='utf-8')

print(f'Updated {len(files)} HTML files.')
