"""Crop each poster to its object and centre it on a 512 square so every card fills the same share of its frame."""
import glob, sys
from PIL import Image
SIZE, FILL = 512, 0.82
for f in sorted(glob.glob('static/posters/*.webp')):
    im = Image.open(f).convert('RGBA')
    bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bb: print('empty', f); continue
    im = im.crop(bb)
    k = SIZE * FILL / max(im.size)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    out = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    out.alpha_composite(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    out.save(f, 'WEBP', quality=84, method=6)
print('normalized')
