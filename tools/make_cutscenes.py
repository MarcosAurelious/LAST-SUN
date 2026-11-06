"""Render The Last Sun's six story cutscenes from the game's own art (backgrounds + sprite sheets).
Usage (from the repo root):  python tools/make_cutscenes.py   -> writes cuts/*.mp4 (960x540, 24 fps, H.264, silent;
the game plays its own music). Needs Pillow, numpy and ffmpeg on PATH.
Each scene is a function of time: panning backgrounds, sprites cycling their real animation frames, embers,
smoke, sun glow, speed lines, flashes and a little camera shake. Captions are drawn by the game over the video,
so the bottom ~28% of each shot is kept calm."""
import math, random, subprocess, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

W, H, FPS = 960, 540, 24
os.makedirs('cuts', exist_ok=True)
_img, _spr = {}, {}

def asset(n):
    if n not in _img: _img[n] = Image.open(f'asset-{n:02d}.webp' if os.path.exists(f'asset-{n:02d}.webp') else f'asset-{n:02d}.png').convert('RGBA')
    return _img[n]

# ---------- sprites ----------
SHEETS = {  # name: (asset, cols, rows)
    'itza': (38, 6, 4), 'balam': (39, 6, 4), 'soldier': (3, 4, 4), 'crossbow': (4, 4, 4), 'panther': (5, 4, 4),
    'eagle': (6, 4, 4), 'jaguar': (7, 4, 4), 'bat': (15, 4, 4), 'pike': (17, 4, 4), 'leopard': (18, 4, 4),
    'sci': (19, 4, 4), 'brute': (20, 4, 4), 'tank': (28, 4, 2)}

def sprite(name, frame, height, flip=False):
    """Return (image, anchor_x, anchor_y): the frame scaled so its CELL is `height` px tall, anchored at the feet."""
    key = (name, int(frame), int(height), flip)
    if key in _spr: return _spr[key]
    n, cols, rows = SHEETS[name]; sh = asset(n); cw, ch = sh.width / cols, sh.height / rows
    f = int(frame) % (cols * rows); x0, y0 = (f % cols) * cw, (f // cols) * ch
    c = sh.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))
    a = np.array(c)[..., 3] > 40; ys, xs = np.where(a)
    feet = ys.max() + 1 if len(ys) else c.height; cx = xs.mean() if len(xs) else c.width / 2
    k = height / c.height; c = c.resize((max(1, round(c.width * k)), max(1, round(c.height * k))), Image.LANCZOS)
    ax, ay = cx * k, feet * k
    if flip: c = c.transpose(Image.FLIP_LEFT_RIGHT); ax = c.width - ax
    _spr[key] = (c, ax, ay); return _spr[key]

def shadow(fr, x, y, w):
    sh = Image.new('RGBA', (int(w * 2.4), 40), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([0, 8, int(w * 2.4) - 1, 32], fill=(0, 0, 0, 120))
    sh = sh.filter(ImageFilter.GaussianBlur(5)); fr.paste(sh, (int(x - w * 1.2), int(y - 20)), sh)

def put(fr, name, frame, x, y, height, flip=False, alpha=1.0, glow=None, ground=True):
    im, ax, ay = sprite(name, frame, height, flip)
    if ground and name not in ('bat', 'tank'): shadow(fr, x, y, height * 0.22)   # contact shadow so nobody hovers
    if alpha < 1: im = im.copy(); im.putalpha(im.getchannel('A').point(lambda v: int(v * alpha)))
    if glow:
        g = Image.new('RGBA', im.size, glow); g.putalpha(im.getchannel('A').filter(ImageFilter.GaussianBlur(8)))
        fr.alpha_composite(g, (round(x - ax), round(y - ay)), ) if x - ax >= 0 and y - ay >= 0 else fr.paste(g, (round(x - ax), round(y - ay)), g)
    pos = (round(x - ax), round(y - ay))
    if pos[0] >= 0 and pos[1] >= 0 and pos[0] + im.width <= W and pos[1] + im.height <= H: fr.alpha_composite(im, pos)
    else: fr.paste(im, pos, im)

# ---------- backgrounds ----------
_bgs = {}
def bg(n, height=H):
    if (n, height) not in _bgs:
        b = asset(n).convert('RGB'); k = height / b.height; _bgs[(n, height)] = b.resize((round(b.width * k), height), Image.LANCZOS)
    return _bgs[(n, height)]

def pan(n, x, zoom=1.0, y_bias=0.0):
    """A 960x540 view of background n, left edge at x (in pixels of the 540-high strip), with optional zoom."""
    b = bg(n, round(H * zoom)); x = max(0, min(b.width - W, x)); y = round((b.height - H) * (0.5 + y_bias))
    return b.crop((round(x), y, round(x) + W, y + H)).convert('RGBA')

def grade(fr, color, amount):
    ov = Image.new('RGBA', fr.size, color + (int(255 * amount),)); fr.alpha_composite(ov)

def vignette(fr, strength=0.55):
    if not hasattr(vignette, 'm'):
        yy, xx = np.mgrid[0:H, 0:W]; r = np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2))
        vignette.m = Image.fromarray((np.clip((r - 0.55) / 0.75, 0, 1) * 255).astype(np.uint8))
    black = Image.new('RGBA', fr.size, (0, 0, 0, 255)); black.putalpha(vignette.m.point(lambda v: int(v * strength))); fr.alpha_composite(black)

def glow(fr, x, y, r, color, a):
    g = Image.new('RGBA', (int(r * 2), int(r * 2)), (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    for i in range(12, 0, -1): d.ellipse([r - r * i / 12, r - r * i / 12, r + r * i / 12, r + r * i / 12], fill=color + (int(a * 255 * (1 - i / 12) ** 1.6),))
    fr.alpha_composite(g, (int(x - r), int(y - r))) if x - r >= 0 and y - r >= 0 else fr.paste(g, (int(x - r), int(y - r)), g)

def embers(fr, t, n=40, seed=1, color=(255, 170, 60), rise=60, area=(0, 0, W, H)):
    d = ImageDraw.Draw(fr); rnd = random.Random(seed)
    for i in range(n):
        x0, sp, ph, s = rnd.uniform(area[0], area[2]), rnd.uniform(0.6, 1.4), rnd.random(), rnd.choice((2, 2, 3, 4))
        p = (t * sp * rise / (area[3] - area[1]) + ph) % 1; y = area[3] - p * (area[3] - area[1]); x = x0 + math.sin(t * 2 + i) * 12
        a = int(255 * math.sin(p * math.pi)); d.rectangle([x, y, x + s, y + s], fill=color + (a,))

def smoke(fr, t, x, y, scale=1.0, seed=3, n=7):
    rnd = random.Random(seed); layer = Image.new('RGBA', fr.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for i in range(n):
        p = (t * 0.12 + i / n + rnd.random() * 0.1) % 1; r = (30 + p * 90) * scale
        cx, cy = x + p * 70 * scale + math.sin(t + i) * 10, y - p * 260 * scale
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(40, 34, 36, int(110 * math.sin(p * math.pi))))
    fr.alpha_composite(layer.filter(ImageFilter.GaussianBlur(10)))

def speedlines(fr, t, a=0.6):
    d = ImageDraw.Draw(fr); rnd = random.Random(int(t * FPS))
    for i in range(16):
        y = rnd.uniform(40, H - 120); x = rnd.uniform(0, W); L = rnd.uniform(80, 260)
        d.line([(x, y), (x - L, y)], fill=(255, 240, 200, int(255 * a * rnd.uniform(0.3, 0.8))), width=rnd.choice((1, 2, 2, 3)))

def flash(fr, a, color=(255, 250, 230)):
    if a > 0: grade(fr, color, min(1, a))

def letterbox(fr, h=34):
    d = ImageDraw.Draw(fr); d.rectangle([0, 0, W, h], fill=(0, 0, 0, 255))   # top bar only: the floor at the bottom must stay visible

def fade(fr, t, dur, fin=0.6, fout=0.7):
    a = max(0, 1 - t / fin) if t < fin else max(0, (t - (dur - fout)) / fout) if t > dur - fout else 0
    if a > 0: grade(fr, (0, 0, 0), a)

def shake(t, amt):
    return (math.sin(t * 61) * amt, math.cos(t * 47) * amt * 0.6)

def render(name, dur, draw):
    out = f'cuts/{name}.mp4'
    p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for i in range(int(dur * FPS)):
        t = i / FPS; fr = draw(t); fade(fr, t, dur); letterbox(fr)
        p.stdin.write(fr.convert('RGB').tobytes())
    p.stdin.close(); p.wait(); print(out, os.path.getsize(out) // 1024, 'KB')

HERO_H = 330      # hero cell height in cutscenes (body ~250px)
GROUND = 499      # top of the stone walkway in the village/jungle backgrounds
FLOOR_CAPITAL, FLOOR_LAB = 447, 455   # walkway tops in the burning capital and the lab

# ---------- 1. THE OATH ----------
def oath(t):
    fr = pan(9, 180 + t * 22, zoom=1.0)
    grade(fr, (255, 140, 40), 0.18 + 0.04 * math.sin(t))                  # golden hour
    glow(fr, 480, 70, 260 + 20 * math.sin(t * 1.5), (255, 210, 110), 0.65)  # the last sun
    embers(fr, t, 30, seed=2, color=(255, 220, 140), rise=40)
    raise_w = t > 3.3                                                        # both raise their weapons to the sun
    put(fr, 'itza', 16 if raise_w else int(t * 2.2) % 2, 360, GROUND, HERO_H)
    put(fr, 'balam', 16 if raise_w else int(t * 2.2 + 1) % 2, 610, GROUND, HERO_H, flip=True)
    if raise_w: glow(fr, 480, 210, 140, (255, 230, 150), min(0.7, (t - 3.3) * 1.2))
    vignette(fr); return fr

# ---------- 2. BEASTS ATTACK ----------
BEASTS = [('panther', 0.0, 250, [4, 5, 6, 5], GROUND, 1.0), ('leopard', 0.5, 260, [4, 5, 6, 7], GROUND, 1.1), ('jaguar', 1.1, 320, [4, 5, 6, 7], GROUND, 0.9),
          ('panther', 1.6, 250, [4, 5, 6, 5], GROUND, 1.15), ('leopard', 2.4, 260, [4, 5, 6, 7], GROUND, 1.05), ('jaguar', 3.0, 320, [4, 5, 6, 7], GROUND, 1.0),
          ('panther', 3.5, 250, [4, 5, 6, 5], GROUND, 1.2)]
def beasts(t):
    sx, sy = shake(t, 2 + t * 0.6)
    fr = pan(10, 700 + sx - t * 15, zoom=1.0)
    grade(fr, (90, 10, 20), 0.22)
    for i in range(4):                                                     # bats sweep overhead
        x = W + 120 - ((t - i * 0.7) * 330) % (W + 260); y = 110 + 40 * math.sin(t * 3 + i) + i * 25
        put(fr, 'bat', [4, 5, 6, 7][int(t * 12 + i) % 4], x, y + 80, 170, flip=True)
    for name, start, h, cyc, y, sp in BEASTS:
        if t < start: continue
        x = W + 160 - (t - start) * 360 * sp
        if -200 < x < W + 220: put(fr, name, cyc[int(t * 12 + start * 7) % len(cyc)], x, y + sy, h, flip=True)
    embers(fr, t, 18, seed=5, color=(255, 90, 60), rise=50)
    vignette(fr, 0.65); return fr

# ---------- 3. THE INVASION ----------
MARCH = [('soldier', [2, 3, 4, 5], 0), ('pike', [4, 5, 6, 7], 1), ('crossbow', [4, 5, 6, 7], 2), ('soldier', [2, 3, 4, 5], 3), ('pike', [4, 5, 6, 7], 4),
         ('soldier', [2, 3, 4, 5], 5), ('crossbow', [4, 5, 6, 7], 6), ('pike', [4, 5, 6, 7], 7)]
def invasion(t):
    fr = pan(13, 120 + t * 18, zoom=1.0, y_bias=0.1)
    smoke(fr, t, 180, 300, 1.2, seed=4); smoke(fr, t, 760, 280, 1.4, seed=8)
    for row, (scale, y0, speed) in enumerate([(190, FLOOR_CAPITAL, 120), (225, FLOOR_CAPITAL + 6, 150)]):  # two ranks marching left
        for name, cyc, i in MARCH:
            x = W - 260 + i * 140 + row * 70 - t * speed
            if -120 < x < W + 140: put(fr, name, cyc[int(t * 8 + i) % len(cyc)], x, y0, scale, flip=True)
    embers(fr, t, 60, seed=9, color=(255, 150, 60), rise=90)
    grade(fr, (120, 30, 10), 0.10); vignette(fr, 0.6); return fr

# ---------- 4. BROTHERS CHARGE ----------
def charge(t):
    fast = t < 3.6
    fr = pan(9, 900 + t * (420 if fast else 60), zoom=1.0)
    embers(fr, t, 40, seed=11, color=(255, 170, 70), rise=80)
    if fast:
        speedlines(fr, t, 0.5)
        put(fr, 'itza', 2 + int(t * 14) % 8, 380, GROUND, HERO_H)
        put(fr, 'balam', 2 + int(t * 14 + 3) % 8, 560, GROUND, HERO_H)
    else:                                                                    # the strike: fiery slash and spirit skull
        k = t - 3.6
        put(fr, 'itza', 16 if k < 0.15 else 17, 380, GROUND, HERO_H)
        put(fr, 'balam', 16 if k < 0.15 else 18, 580, GROUND, HERO_H)
        flash(fr, max(0, 0.9 - k * 2.5) if k > 0.15 else 0)
    vignette(fr, 0.5); return fr

# ---------- 5. THE GARRISON (Stage 1 boss) ----------
def garrison(t):
    fr = pan(9, 1500 - t * 40, zoom=1.0)
    grade(fr, (30, 20, 40), 0.25)
    aim = t > 2.2; fire = t > 3.4
    for i, x in enumerate([180, 330, 480, 630, 780]):
        y = GROUND; name = 'crossbow' if i in (1, 3) else 'soldier'
        if not aim: f = [0, 1][int(t * 2 + i) % 2]
        elif name == 'soldier': f = 7 if fire and int(t * 10 + i) % 3 == 0 else 6
        else: f = 10 if fire and int(t * 10 + i) % 3 == 0 else 8
        put(fr, name, f, x, y, 215, flip=True)
    if fire: flash(fr, 0.18 * (int(t * 10) % 2))
    vignette(fr, 0.6); return fr

# ---------- 6. THE MAD ALCHEMIST (Stage 6 boss) ----------
def alchemist(t):
    sx, sy = shake(t, 0 if t < 3.2 else 5)
    fr = pan(14, 1250 + sx, zoom=1.0)
    grade(fr, (10, 40, 10), 0.18)
    burst = t > 3.2
    if not burst: put(fr, 'tank', int(t * 7) % 8, 700, FLOOR_LAB + sy, 340)
    else:
        glow(fr, 700, 320, 220, (150, 255, 90), max(0, 0.8 - (t - 3.2)))
        put(fr, 'brute', 12 if t < 4.3 else [0, 1][int(t * 3) % 2], 700, FLOOR_LAB + sy, 320, flip=True)
    put(fr, 'sci', 4 if 2.4 < t < 3.2 else [0, 1][int(t * 3) % 2], 330, FLOOR_LAB + sy, 260)
    for i in range(18):                                                    # rising green bubbles
        p = (t * 0.5 + i / 18) % 1; x = 640 + (i * 37) % 120; y = FLOOR_LAB - 40 - p * 300
        ImageDraw.Draw(fr).ellipse([x, y, x + 6, y + 6], outline=(170, 255, 120, int(200 * (1 - p))), width=2)
    if burst: flash(fr, max(0, 0.9 - (t - 3.2) * 3), (200, 255, 150))
    vignette(fr, 0.6); return fr

if __name__ == '__main__':
    render('01_Oath', 5.5, oath)
    render('02_Beasts_Attack', 5.0, beasts)
    render('03_Invasion', 5.5, invasion)
    render('04_Brothers_Charge', 5.0, charge)
    render('Level_1_Five_Soldier_Garrison', 5.0, garrison)
    render('Level_06_The_Mad_Alchemist', 5.5, alchemist)
