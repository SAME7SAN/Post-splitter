"""يولّد أيقونات الإضافة (PNG) + نسخة SVG داخل extension/icons. التشغيل: python3 tools/make_icons.py"""
from PIL import Image, ImageDraw
import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "extension"))

BG, PAGE, FOLD, INK = "#111111", "#FFFFFF", "#CFCFCF", "#111111"

def layout(small):
    # (x1, x2, y, thickness) لكل سطر؛ وحدات من 0 إلى 100
    L, R, S = 34, 66, 55
    if small:  # نسخة 16px: ثلاثة أسطر سميكة فقط
        return [(L, R, 30, 6), (L, R, 47, 6), (L, S, 64, 6)]
    rows = []
    for g in (28, 47, 66):  # ثلاث مجموعات، كل منها سطران
        rows += [(L, R, g, 4), (L, S, g + 8, 4)]
    return rows

def render(size, small=False, scale=8):
    N = size * scale; u = N / 100
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, N - 1, N - 1], radius=22 * u, fill=BG)
    px1, py1, px2, py2, fold = 24, 12, 76, 90, 14
    d.rounded_rectangle([px1 * u, py1 * u, px2 * u, py2 * u], radius=5 * u, fill=PAGE)
    # زاوية مطوية
    d.polygon([((px2 - fold) * u, py1 * u), (px2 * u, (py1 + fold) * u), ((px2 - fold) * u, (py1 + fold) * u)], fill=FOLD)
    d.polygon([((px2 - fold) * u - 1, (py1 - 0.5) * u), (px2 * u + 1, (py1 - 0.5) * u), (px2 * u + 1, (py1 + fold) * u)], fill=BG)
    for x1, x2, y, t in layout(small):
        d.rounded_rectangle([x1 * u, y * u, x2 * u, (y + t) * u], radius=t / 2 * u, fill=INK)
    return im.resize((size, size), Image.LANCZOS)

os.makedirs("icons", exist_ok=True)
for s in (16, 32, 48, 128):
    render(s, small=(s <= 16)).save(f"icons/icon-{s}.png")

# SVG مطابق للتصميم الكبير
rows = "".join(f'<rect x="{x1}" y="{y}" width="{x2-x1}" height="4" rx="2" fill="{INK}"/>' for x1, x2, y, t in layout(False))
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
<rect width="100" height="100" rx="22" fill="{BG}"/>
<path d="M29 12H62L76 26V85a5 5 0 0 1-5 5H29a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5Z" fill="{PAGE}"/>
<path d="M62 12L76 26H62Z" fill="{FOLD}"/>
{rows}
</svg>'''
open("icons/icon.svg", "w").write(svg)
