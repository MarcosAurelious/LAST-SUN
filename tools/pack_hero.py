"""Pack a generated 6x4 hero sheet (24 frames, transparent PNG) into The Last Sun's hero atlas.
Usage: python tools_pack_hero.py SRC.png OUT.webp NAME   -> prints the animation-data.js lines.
Each frame: cut from its grid cell, scaled so the idle pose matches the old size, feet placed on a
common line, body centred (glowing effects ignored), stored at 1.5x the old resolution."""
import sys, json, numpy as np
from PIL import Image
src, out, name = sys.argv[1:4]
im = Image.open(src).convert('RGBA'); A = np.array(im); A[..., 3][A[..., 3] < 24] = 0
H, W = A.shape[:2]; cw, ch = W / 6, H / 4
CW, CH = 448, 384; FEET = round(0.89 * CH); IDLE_H = 0.77 * CH
def fx(c):
    r, g, b = [c[..., i].astype(int) for i in range(3)]
    return ((r > 220) & (g > 150) & (b < 120)) | ((b > 215) & (r > 185) & (g < 170))   # flame/flash, bright violet energy (not a darker purple cape)
cells = []
for i in range(24):
    y0, x0 = round((i // 6) * ch), round((i % 6) * cw)
    c = A[y0:round(y0 + ch), x0:round(x0 + cw)]
    from scipy import ndimage   # keep the hero and anything near him; drop slivers of the neighbouring frame
    m = c[..., 3] > 0; lab, n = ndimage.label(m, np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1)); main = lab == (np.argmax(sizes) + 1)
        near = ndimage.binary_dilation(main, iterations=int(0.12 * c.shape[0]))
        keep = np.isin(lab, np.unique(lab[near & m])); c = c.copy(); c[..., 3] = np.where(keep, c[..., 3], 0)
    ys, xs = np.where(c[..., 3] > 0); c = c[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    body = (c[..., 3] > 60) & ~fx(c); by, bx = np.where(body)
    cells.append((c, bx.mean(), by.max() + 1))
k = IDLE_H / np.median([cells[i][0].shape[0] for i in (0, 1)])
sheet = Image.new('RGBA', (CW * 6, CH * 4), (0, 0, 0, 0)); anch = []
for i, (c, cx, feet) in enumerate(cells):
    img = Image.fromarray(c).resize((max(1, round(c.shape[1] * k)), max(1, round(c.shape[0] * k))), Image.LANCZOS)
    ox = round(CW / 2 - cx * k); oy = round(FEET - feet * k)
    tile = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); tile.alpha_composite(img, (ox, oy)) if ox >= 0 and oy >= 0 else tile.paste(img, (ox, oy), img)
    sheet.alpha_composite(tile, ((i % 6) * CW, (i // 6) * CH)); anch.append([0.5, round(FEET / CH, 4)])
sheet.save(out, 'WEBP', quality=90, alpha_quality=92, method=6)
print(f'window.__ANCH.{name}={json.dumps(anch, separators=(",", ":"))};')
print(f'window.__CELLS2.{name}=[{CW},{CH}];')
print(f'scale {k:.3f}', file=sys.stderr)
