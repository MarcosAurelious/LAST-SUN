"""Vertical 9:16 social-media trailer for The Last Sun (TikTok / Reels / Shorts), built from the game's own art.
Usage (repo root): python tools/make_ad.py FONT_DIR SONG.mp3 OUT.mp4
1080x1920, 30 fps, ~20 s. Each shot is composed on a 540x540 pixel-art stage, scaled 2x with nearest-neighbour
(crisp pixels) into a square band, over a blurred, darkened copy of itself; big Bebas Neue titles above and below."""
import math, random, subprocess, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.argv, ARGS = sys.argv[:1], sys.argv[1:]
exec(open(os.path.join(os.path.dirname(__file__), 'make_cutscenes.py')).read().split("if __name__")[0])   # reuse sprite/bg/fx helpers
FONT_DIR, SONG, OUT = ARGS
SHEETS.update({'boss2': (40, 4, 4), 'boss3': (41, 4, 4), 'boss4': (42, 4, 4), 'boss5': (43, 4, 4), 'boss6': (44, 4, 4)})
VW, VH, FPS2, S = 1080, 1920, 30, 540          # video size, fps, square stage size
BAND_Y = 470                                   # top of the 1080x1080 picture band
BEBAS = os.path.join(FONT_DIR, 'bebas-neue-latin-400-normal.ttf'); METAL = os.path.join(FONT_DIR, 'metal-mania-latin-400-normal.ttf')
_f = {}
def font(path, size):
    if (path, size) not in _f: _f[(path, size)] = ImageFont.truetype(path, size)
    return _f[(path, size)]

def stage(n, cx, floor_y=None, y_bias=0.0):
    """540x540 square view of background n centred at cx (background scaled to 540 high)."""
    b = bg(n, S); x = int(max(0, min(b.width - S, cx - S / 2)))
    return b.crop((x, 0, x + S, S)).convert('RGBA')

def text(img, s, y, size, path=None, fill=(255, 226, 150), stroke=(30, 10, 0), sw=6, scale=1.0, alpha=1.0, spacing=0):
    if alpha <= 0: return
    f = font(path or BEBAS, max(8, int(size * scale)))
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    w = d.textlength(s, font=f) + spacing * (len(s) - 1)
    x = (VW - w) / 2
    if spacing:
        for ch in s: d.text((x, y), ch, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke); x += d.textlength(ch, font=f) + spacing
    else: d.text((x, y), s, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke)
    if alpha < 1: layer.putalpha(layer.getchannel('A').point(lambda v: int(v * alpha)))
    img.alpha_composite(layer)

def pop(t, t0, dur=0.25):
    """0..1 entrance with overshoot."""
    k = (t - t0) / dur
    if k <= 0: return 0
    if k >= 1: return 1
    return 1 + 0.25 * math.sin(k * math.pi) - (1 - k) ** 2 * 0

def frame_from(sq, t):
    """Square stage -> full 1080x1920 frame: blurred backdrop + crisp 2x band + gold frame lines."""
    big = sq.resize((1080, 1080), Image.NEAREST)
    back = sq.resize((VH, VH), Image.BILINEAR).crop(((VH - VW) // 2, 0, (VH - VW) // 2 + VW, VH)).filter(ImageFilter.GaussianBlur(18))
    out = back.copy(); grade(out, (8, 4, 10), 0.62)
    out.alpha_composite(big, (0, BAND_Y))
    d = ImageDraw.Draw(out)
    for y in (BAND_Y - 6, BAND_Y + 1080):
        d.rectangle([0, y, VW, y + 5], fill=(214, 168, 72, 255))
    return out

# ---------------- shots (each returns a 540x540 stage) ----------------
F = 486   # floor on the square stage for the village / jungle strips (walkway top 499 -> *540/540)
def shot_title(t):
    sq = stage(13, 860 + t * 30)
    glow(sq, 270, 150, 220 + 30 * math.sin(t * 2), (255, 200, 90), 0.6)
    smoke(sq, t, 60, 330, 0.9, seed=4); smoke(sq, t, 470, 300, 0.9, seed=8)
    embers(sq, t, 50, seed=3, color=(255, 170, 70), rise=110, area=(0, 0, S, S))
    return sq

def shot_hero(hero, n, cx, t, t0):
    sq = stage(n, cx + (t - t0) * 25)
    grade(sq, (255, 140, 40) if hero == 'itza' else (90, 30, 140), 0.12)
    k = t - t0; f = (0, 1)[int(t * 3) % 2] if k < 1.0 else 16 if k < 1.25 else (17 if hero == 'itza' else 18)
    put(sq, hero, f, 250, F, 470)
    if 1.25 < k < 1.6: flash(sq, (1.6 - k) * 2.2)
    embers(sq, t, 30, seed=7, color=(255, 210, 130) if hero == 'itza' else (210, 140, 255), rise=70, area=(0, 0, S, S))
    return sq

def shot_beasts(t, t0):
    k = t - t0; sx, sy = shake(t, 3)
    sq = stage(10, 900 + sx - k * 40); grade(sq, (90, 10, 20), 0.22)
    for name, start, h, cyc, sp in [('panther', 0.0, 230, [4, 5, 6, 5], 1.0), ('jaguar', 0.4, 300, [4, 5, 6, 7], 0.85), ('leopard', 0.9, 240, [4, 5, 6, 7], 1.1),
                                     ('panther', 1.5, 230, [4, 5, 6, 5], 1.2), ('jaguar', 1.9, 300, [4, 5, 6, 7], 0.95)]:
        if k < start: continue
        x = S + 150 - (k - start) * 330 * sp
        if -200 < x < S + 220: put(sq, name, cyc[int(t * 14 + start * 7) % len(cyc)], x, F + sy, h, flip=True)
    for i in range(3):
        x = S + 100 - ((k - i * 0.5) * 300) % (S + 220); put(sq, 'bat', [4, 5, 6, 7][int(t * 12 + i) % 4], x, 150 + i * 40 + 30 * math.sin(t * 3 + i), 150, flip=True)
    return sq

BOSSES = [('boss2', 9, 1900, F, [6, 7, 8]), ('boss3', 11, 1700, 503, [5, 6, 7]), ('boss4', 12, 1500, 503, [4, 5, 7]), ('boss5', 13, 1200, 452, [9, 10, 11]), ('boss6', 14, 1500, 462, [8, 9, 11])]
def shot_bosses(t, t0):
    k = t - t0; i = min(len(BOSSES) - 1, int(k / 0.7)); name, n, cx, floor, frames = BOSSES[i]; kk = k - i * 0.7
    sq = stage(n, cx + kk * 30)
    f = frames[min(2, int(kk / 0.7 * 3))]
    put(sq, name, f, 290, floor, 470, flip=True)
    if kk < 0.1: flash(sq, 0.35 - kk * 3.5)
    return sq

def shot_charge(t, t0):
    k = t - t0; sq = stage(9, 1400 + k * 520)
    speedlines_sq(sq, t)
    put(sq, 'itza', 2 + int(t * 16) % 8, 190, F, 360); put(sq, 'balam', 2 + int(t * 16 + 3) % 8, 360, F, 360)
    embers(sq, t, 25, seed=12, color=(255, 170, 70), rise=90, area=(0, 0, S, S))
    return sq

def speedlines_sq(sq, t):
    d = ImageDraw.Draw(sq); rnd = random.Random(int(t * 30))
    for i in range(12):
        y = rnd.uniform(30, S - 80); x = rnd.uniform(0, S); L = rnd.uniform(60, 180)
        d.line([(x, y), (x - L, y)], fill=(255, 240, 200, int(255 * rnd.uniform(0.2, 0.5))), width=rnd.choice((1, 2)))

def shot_end(t):
    sq = stage(9, 520)
    grade(sq, (255, 140, 40), 0.18); glow(sq, 270, 80, 240, (255, 210, 110), 0.6)
    put(sq, 'itza', 16, 170, F, 400); put(sq, 'balam', 16, 370, F, 400, flip=True)
    glow(sq, 270, 210, 120, (255, 230, 150), 0.35 + 0.1 * math.sin(t * 4))
    embers(sq, t, 30, seed=2, color=(255, 220, 140), rise=50, area=(0, 0, S, S))
    return sq

# ---------------- timeline ----------------
SHOTS = [(0.0, 3.0, 'title'), (3.0, 5.6, 'itza'), (5.6, 8.2, 'balam'), (8.2, 11.0, 'beasts'), (11.0, 14.5, 'bosses'), (14.5, 16.6, 'charge'), (16.6, 20.5, 'end')]
DUR = 20.5
def draw(t):
    for t0, t1, name in SHOTS:
        if t0 <= t < t1: break
    sq = {'title': lambda: shot_title(t), 'itza': lambda: shot_hero('itza', 9, 700, t, t0), 'balam': lambda: shot_hero('balam', 10, 1500, t, t0),
          'beasts': lambda: shot_beasts(t, t0), 'bosses': lambda: shot_bosses(t, t0), 'charge': lambda: shot_charge(t, t0), 'end': lambda: shot_end(t)}[name]()
    vignette_sq(sq); fr = frame_from(sq, t); k = t - t0
    cut_flash = max(0, 0.35 - k * 2.5) if t0 > 0 else 0
    if name == 'title':
        s = pop(t, 0.35, 0.3); text(fr, 'THE LAST SUN', 150, 210, scale=0.6 + 0.4 * s, alpha=min(1, s * 2), sw=8)
        text(fr, 'BROTHERS OF THE JAGUAR', 1590, 92, alpha=min(1, max(0, (t - 1.1) * 2)), fill=(255, 255, 255))
        text(fr, 'A RETRO RUN-AND-GUN ADVENTURE', 1710, 58, alpha=min(1, max(0, (t - 1.6) * 2)), fill=(214, 168, 72), sw=4)
        if 0.35 < t < 0.7: grade(fr, (255, 245, 220), (0.7 - t) * 2)
    elif name in ('itza', 'balam'):
        nm, tag, col = ('ITZÁ', 'THE JAGUAR WARRIOR', (255, 200, 90)) if name == 'itza' else ('BALAM', 'THE SHADOW SORCERER', (205, 150, 255))
        s = pop(t, t0 + 0.1); text(fr, nm, 150, 240, fill=col, scale=0.7 + 0.3 * s, alpha=min(1, s * 2), sw=9)
        text(fr, tag, 1600, 96, fill=(255, 255, 255), alpha=min(1, max(0, (k - 0.4) * 3)))
    elif name == 'beasts':
        text(fr, 'THE JUNGLE', 120, 170, alpha=min(1, k * 4)); text(fr, 'HAS TURNED', 290, 120, fill=(255, 110, 80), alpha=min(1, max(0, (k - 0.3) * 4)))
        text(fr, 'BEASTS · CONQUISTADORS · MONSTERS', 1610, 64, fill=(255, 255, 255), sw=4, alpha=min(1, max(0, (k - 0.6) * 3)))
    elif name == 'bosses':
        text(fr, 'EPIC BOSS', 120, 170, alpha=min(1, k * 4)); text(fr, 'BATTLES', 290, 140, fill=(255, 110, 80), alpha=min(1, max(0, (k - 0.2) * 4)))
        names = ['THE IRON CAPTAIN', 'THE CENOTE ABOMINATION', 'THE FEATHERED GUARDIAN', 'THE SIEGE WARLORD', 'THE MAD ALCHEMIST']
        text(fr, names[min(4, int(k / 0.7))], 1610, 80, fill=(255, 255, 255))
    elif name == 'charge':
        text(fr, '1 OR 2 PLAYERS', 150, 170, alpha=min(1, k * 4)); text(fr, 'CO-OP', 1600, 130, fill=(255, 110, 80), alpha=min(1, max(0, (k - 0.3) * 4)))
    elif name == 'end':
        s = pop(t, t0 + 0.15, 0.3); text(fr, 'THE LAST SUN', 140, 190, scale=0.7 + 0.3 * s, alpha=min(1, s * 2), sw=8)
        text(fr, 'PLAY FREE IN YOUR BROWSER', 1580, 84, fill=(255, 255, 255), alpha=min(1, max(0, (k - 0.5) * 3)))
        text(fr, 'MARCOSAURELIOUS.GITHUB.IO/LAST-SUN', 1690, 56, fill=(255, 210, 110), sw=4, alpha=min(1, max(0, (k - 0.9) * 3)))
        text(fr, 'A GAME BY MARCOS GARCIA', 1790, 44, fill=(200, 190, 170), sw=3, alpha=min(1, max(0, (k - 1.3) * 3)))
    if cut_flash: grade(fr, (255, 245, 225), cut_flash)
    a = max(0, 1 - t / 0.35) + max(0, (t - (DUR - 0.5)) / 0.5)
    if a > 0: grade(fr, (0, 0, 0), min(1, a))
    return fr

def vignette_sq(sq):
    if not hasattr(vignette_sq, 'm'):
        yy, xx = np.mgrid[0:S, 0:S]; r = np.hypot((xx - S / 2) / (S / 2), (yy - S / 2) / (S / 2))
        vignette_sq.m = Image.fromarray((np.clip((r - 0.7) / 0.6, 0, 1) * 150).astype(np.uint8))
    black = Image.new('RGBA', (S, S), (0, 0, 0, 255)); black.putalpha(vignette_sq.m); sq.alpha_composite(black)

if __name__ == '__main__':
    silent = OUT.replace('.mp4', '_silent.mp4')
    p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{VW}x{VH}', '-r', str(FPS2), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', silent], stdin=subprocess.PIPE)
    for i in range(int(DUR * FPS2)): p.stdin.write(draw(i / FPS2).convert('RGB').tobytes())
    p.stdin.close(); p.wait()
    # soundtrack: Marcos's own song, starting just before the beat drops so it hits on the title slam
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', silent, '-ss', '10.6', '-i', SONG, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                    '-af', f'afade=t=in:d=0.3,afade=t=out:st={DUR - 1.6}:d=1.6', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], check=True)
    os.remove(silent); print(OUT, os.path.getsize(OUT) // 1024, 'KB')
