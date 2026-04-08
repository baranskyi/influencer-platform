#!/usr/bin/env python3
"""
Generate a Problem/Solution promotional slide in Brandie (brandea.today) visual style.
Output: 1920x1080 landscape PNG with dark purple space gradient, sparkles, glow effects.
"""

import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ─── Configuration ───────────────────────────────────────────────────────────
WIDTH, HEIGHT = 1920, 1080
OUTPUT_PATH = "/Users/slavabaranskyi/Personal-Super-Agent/Projects/influencer-platform/promo/google-ads/problem-solution-slide-1920x1080.png"

# Brand colors
BG_TOP = (12, 8, 28)        # Deep space
BG_MID = (22, 14, 50)       # Rich purple
BG_BOT = (35, 22, 72)       # Lighter purple at bottom
CORAL = (255, 107, 107)     # #FF6B6B
GREEN = (74, 222, 128)      # #4ADE80
TEAL = (45, 212, 191)       # #2DD4BF
WHITE = (255, 255, 255)
CTA_ORANGE = (255, 115, 75) # Coral-orange CTA
PURPLE_GLOW = (140, 80, 220)
PINK_GLOW = (200, 60, 140)
MUTED_TEXT = (155, 145, 180) # Muted purple-gray for secondary text

random.seed(42)


# ─── Font Loading ────────────────────────────────────────────────────────────
def load_font(size, index=0):
    """Try system fonts in order of preference."""
    font_paths = [
        ("/System/Library/Fonts/Helvetica.ttc", True),
        ("/Library/Fonts/Arial Bold.ttf", False),
        ("/System/Library/Fonts/SFCompact.ttf", False),
        ("/System/Library/Fonts/SFNS.ttf", False),
    ]
    for path, is_collection in font_paths:
        try:
            if is_collection:
                return ImageFont.truetype(path, size, index=index)
            else:
                return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


# ─── Background Gradient ─────────────────────────────────────────────────────
def draw_gradient(img):
    """Draw a smooth vertical gradient with a subtle radial purple center."""
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        t = y / HEIGHT
        if t < 0.4:
            s = t / 0.4
            r = int(BG_TOP[0] + (BG_MID[0] - BG_TOP[0]) * s)
            g = int(BG_TOP[1] + (BG_MID[1] - BG_TOP[1]) * s)
            b = int(BG_TOP[2] + (BG_MID[2] - BG_TOP[2]) * s)
        else:
            s = (t - 0.4) / 0.6
            r = int(BG_MID[0] + (BG_BOT[0] - BG_MID[0]) * s)
            g = int(BG_MID[1] + (BG_BOT[1] - BG_MID[1]) * s)
            b = int(BG_MID[2] + (BG_BOT[2] - BG_MID[2]) * s)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    return img


# ─── Stars / Sparkles ────────────────────────────────────────────────────────
def draw_stars(draw, count=220):
    """Scatter small white/purple dots across the background."""
    for _ in range(count):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        brightness = random.randint(120, 255)
        size = random.choices([1, 2, 3], weights=[60, 30, 10])[0]
        # Slight color variation
        if random.random() < 0.25:
            color = (min(255, brightness + 10), brightness - 20, min(255, brightness + 40))
        elif random.random() < 0.15:
            color = (brightness - 10, brightness, min(255, brightness + 20))
        else:
            color = (brightness, brightness, brightness)

        if size == 1:
            draw.point((x, y), fill=color)
        else:
            draw.ellipse([x - size, y - size, x + size, y + size], fill=color)

    # Brighter sparkle crosses
    for _ in range(20):
        x = random.randint(60, WIDTH - 60)
        y = random.randint(40, HEIGHT - 40)
        brightness = random.randint(210, 255)
        arm = random.randint(5, 14)
        color = (brightness, brightness, min(255, brightness + 15))
        # Cross shape
        draw.line([(x - arm, y), (x + arm, y)], fill=color, width=1)
        draw.line([(x, y - arm), (x, y + arm)], fill=color, width=1)
        # Center bright dot
        draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(255, 255, 255))


# ─── Constellation Lines ─────────────────────────────────────────────────────
def draw_constellation(draw, cx, cy, scale=1.0, pattern=0):
    """Draw a small constellation pattern (connected dots)."""
    patterns = [
        [(0, 0), (25, -18), (50, -12), (65, 8), (55, 30), (28, 24)],
        [(0, 0), (20, -25), (50, -20), (40, 5), (60, 15)],
        [(0, 0), (30, -10), (15, 15), (45, 20), (35, -5)],
    ]
    points = patterns[pattern % len(patterns)]
    scaled = [(int(cx + p[0] * scale), int(cy + p[1] * scale)) for p in points]
    line_color = (100, 80, 160)
    dot_color = (200, 190, 240)

    for i in range(len(scaled) - 1):
        draw.line([scaled[i], scaled[i + 1]], fill=line_color, width=1)
    for pt in scaled:
        draw.ellipse([pt[0] - 2, pt[1] - 2, pt[0] + 2, pt[1] + 2], fill=dot_color)


# ─── Glow Effects ────────────────────────────────────────────────────────────
def create_glow_layer(cx, cy, radius, color, intensity=100):
    """Create an RGBA glow layer."""
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = max(10, radius // 3)
    for i in range(steps):
        t = i / steps
        r = int(radius * (1 - t))
        alpha = int(intensity * (1 - t) ** 1.5)
        alpha = max(0, min(255, alpha))
        if r > 0:
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=radius // 2))
    return layer


def apply_glow(base_img, cx, cy, radius, color, intensity=100):
    """Apply a glow effect to the base image."""
    glow = create_glow_layer(cx, cy, radius, color, intensity)
    base_rgba = base_img.convert("RGBA")
    result = Image.alpha_composite(base_rgba, glow)
    return result.convert("RGB")


# ─── Vertical Divider ────────────────────────────────────────────────────────
def draw_divider(draw, x):
    """Draw a subtle glassmorphic vertical divider line with fade."""
    top_margin = 130
    bottom_margin = 130
    mid = HEIGHT // 2
    for y in range(top_margin, HEIGHT - bottom_margin):
        dist = abs(y - mid) / (mid - top_margin)
        alpha_factor = max(0, 1 - dist ** 1.5)
        # Main line
        brightness = int(160 * alpha_factor)
        if brightness > 10:
            color = (140 + brightness // 8, 120 + brightness // 10, 200 + brightness // 6)
            color = tuple(min(255, c) for c in color)
            draw.point((x, y), fill=color)
            # Glow width
            glow_b = brightness // 3
            if glow_b > 5:
                gc = (100 + glow_b // 4, 80 + glow_b // 5, 160 + glow_b // 3)
                gc = tuple(min(255, c) for c in gc)
                draw.point((x - 1, y), fill=gc)
                draw.point((x + 1, y), fill=gc)
                if glow_b > 20:
                    gc2 = (80 + glow_b // 6, 60 + glow_b // 8, 130 + glow_b // 4)
                    gc2 = tuple(min(255, c) for c in gc2)
                    draw.point((x - 2, y), fill=gc2)
                    draw.point((x + 2, y), fill=gc2)


# ─── CTA Button ──────────────────────────────────────────────────────────────
def draw_cta_button(img, cx, cy, text, font):
    """Draw a rounded coral/orange CTA button with glow."""
    draw = ImageDraw.Draw(img)
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 44, 18
    x0 = cx - tw // 2 - pad_x
    y0 = cy - th // 2 - pad_y
    x1 = cx + tw // 2 + pad_x
    y1 = cy + th // 2 + pad_y
    radius = 16

    # Glow behind button
    img = apply_glow(img, cx, cy, 80, CTA_ORANGE, intensity=50)
    draw = ImageDraw.Draw(img)

    # Button background
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=CTA_ORANGE)
    # Top highlight
    highlight_color = (255, 145, 110)
    draw.rounded_rectangle([x0 + 3, y0 + 3, x1 - 3, y0 + (y1 - y0) // 2],
                           radius=radius, fill=highlight_color)
    # Re-draw bottom half to clean up
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=CTA_ORANGE)
    # Lighter top portion for 3D effect
    for i in range(int((y1 - y0) * 0.4)):
        t = i / ((y1 - y0) * 0.4)
        r_val = min(255, int(CTA_ORANGE[0] + (255 - CTA_ORANGE[0]) * 0.3 * (1 - t)))
        g_val = min(255, int(CTA_ORANGE[1] + (255 - CTA_ORANGE[1]) * 0.2 * (1 - t)))
        b_val = min(255, int(CTA_ORANGE[2] + (255 - CTA_ORANGE[2]) * 0.15 * (1 - t)))
        y_line = y0 + i + 4
        if y_line < y1 - radius:
            draw.line([(x0 + radius, y_line), (x1 - radius, y_line)],
                      fill=(r_val, g_val, b_val))

    # Button border
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                           outline=(255, 160, 130), width=1)

    # Text
    text_x = cx - tw // 2
    text_y = cy - th // 2 - 3
    draw.text((text_x, text_y), text, fill=WHITE, font=font)

    return img


# ─── Glass Panel ─────────────────────────────────────────────────────────────
def draw_glass_panel(img, x0, y0, x1, y1, border_color, radius=22):
    """Draw a frosted glass panel with gradient border."""
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    # Semi-transparent fill
    d.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                        fill=(25, 18, 55, 35))

    # Inner subtle gradient (lighter at top)
    for i in range(min(80, (y1 - y0) // 4)):
        t = i / 80
        alpha = int(15 * (1 - t))
        d.line([(x0 + radius, y0 + i + 2), (x1 - radius, y0 + i + 2)],
               fill=(255, 255, 255, alpha))

    # Border with reduced opacity
    border_with_alpha = border_color + (50,)
    d.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                        outline=border_with_alpha, width=1)

    # Slightly brighter border on top edge
    border_bright = border_color + (80,)
    d.rounded_rectangle([x0, y0, x1, y0 + (y1 - y0) // 3], radius=radius,
                        outline=border_bright, width=1)

    img_rgba = img.convert("RGBA")
    result = Image.alpha_composite(img_rgba, overlay)
    return result.convert("RGB")


# ─── Text Helpers ────────────────────────────────────────────────────────────
def text_width(font, text):
    bbox = font.getbbox(text)
    return bbox[2] - bbox[0]


def text_height(font, text):
    bbox = font.getbbox(text)
    return bbox[3] - bbox[1]


def draw_text_centered(draw, cx, y, text, font, fill):
    """Draw text centered horizontally at cx."""
    tw = text_width(font, text)
    draw.text((cx - tw // 2, y), text, fill=fill, font=font)
    return text_height(font, text)


# ─── Main Rendering ──────────────────────────────────────────────────────────
def generate_slide():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_TOP)

    # 1. Background gradient
    draw_gradient(img)

    # 2. Large ambient glow effects (atmospheric depth)
    # Central purple nebula
    img = apply_glow(img, WIDTH // 2, HEIGHT // 2 - 50, 500, (80, 40, 150), intensity=30)
    # Problem side: warm pink/red ambient
    img = apply_glow(img, 400, 400, 380, (180, 50, 100), intensity=28)
    img = apply_glow(img, 300, 700, 250, (160, 40, 80), intensity=18)
    # Solution side: cool green/teal ambient
    img = apply_glow(img, 1500, 380, 380, (40, 160, 110), intensity=25)
    img = apply_glow(img, 1550, 720, 250, (50, 140, 100), intensity=18)
    # Corner accents
    img = apply_glow(img, 0, HEIGHT, 300, (100, 50, 180), intensity=22)
    img = apply_glow(img, WIDTH, 0, 300, (60, 30, 140), intensity=18)

    # 3. Stars and sparkles
    draw = ImageDraw.Draw(img)
    draw_stars(draw, count=250)

    # 4. Constellation patterns
    draw_constellation(draw, 70, 60, scale=1.3, pattern=0)
    draw_constellation(draw, WIDTH - 160, 55, scale=1.1, pattern=1)
    draw_constellation(draw, 85, HEIGHT - 120, scale=0.9, pattern=2)
    draw_constellation(draw, WIDTH - 130, HEIGHT - 100, scale=1.0, pattern=0)
    # Additional small ones
    draw_constellation(draw, 200, HEIGHT - 60, scale=0.6, pattern=1)
    draw_constellation(draw, WIDTH // 2 - 30, 30, scale=0.7, pattern=2)

    # (Content removed — background only)

    # ─── Edge Vignette ────────────────────────────────────────────────────
    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    # Top
    for i in range(80):
        alpha = int(50 * (1 - i / 80) ** 1.5)
        v_draw.line([(0, i), (WIDTH, i)], fill=(0, 0, 0, alpha))
    # Bottom
    for i in range(80):
        alpha = int(50 * (1 - i / 80) ** 1.5)
        v_draw.line([(0, HEIGHT - 1 - i), (WIDTH, HEIGHT - 1 - i)], fill=(0, 0, 0, alpha))
    # Left
    for i in range(50):
        alpha = int(35 * (1 - i / 50) ** 1.5)
        v_draw.line([(i, 0), (i, HEIGHT)], fill=(0, 0, 0, alpha))
    # Right
    for i in range(50):
        alpha = int(35 * (1 - i / 50) ** 1.5)
        v_draw.line([(WIDTH - 1 - i, 0), (WIDTH - 1 - i, HEIGHT)], fill=(0, 0, 0, alpha))

    img_rgba = img.convert("RGBA")
    result = Image.alpha_composite(img_rgba, vignette)
    img = result.convert("RGB")

    # Save
    img.save(OUTPUT_PATH, "PNG")
    print(f"Slide saved to: {OUTPUT_PATH}")
    print(f"Size: {WIDTH}x{HEIGHT}")


if __name__ == "__main__":
    generate_slide()
