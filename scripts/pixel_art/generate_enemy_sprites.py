#!/usr/bin/env python3
"""
Generate authentic 1990s pixel art enemy sprites for MerterBlaster.
Creates Zapper and Chaser enemy types with 3-frame movement animations each.
Uses 256-color palette maximum with manual anti-aliasing and CRT-aware design.
"""

from PIL import Image, ImageDraw
import math
import os

# Reuse the palette creation function from player sprite script
def create_1990s_palette():
    """Create a 256-color palette inspired by 1990s VGA games."""
    palette = []
    
    # Basic 16 EGA colors (0-15)
    ega_colors = [
        (0, 0, 0),        # 0: Black
        (0, 0, 170),      # 1: Blue
        (0, 170, 0),      # 2: Green
        (0, 170, 170),    # 3: Cyan
        (170, 0, 0),      # 4: Red
        (170, 0, 170),    # 5: Magenta
        (170, 85, 0),     # 6: Brown
        (170, 170, 170),  # 7: Light Gray
        (85, 85, 85),     # 8: Dark Gray
        (85, 85, 255),    # 9: Light Blue
        (85, 255, 85),    # 10: Light Green
        (85, 255, 255),   # 11: Light Cyan
        (255, 85, 85),    # 12: Light Red
        (255, 85, 255),   # 13: Light Magenta
        (255, 255, 85),   # 14: Yellow
        (255, 255, 255),  # 15: White
    ]
    
    palette.extend(ega_colors)
    
    # Add more colors for a 256-color palette
    # Create gradients for enemy colors (reds, purples, greens)
    for i in range(16, 256):
        if i < 80:
            # Red/purple gradients for Zapper
            r = max(0, min(255, 150 + (i - 16) * 1))
            g = max(0, min(255, 30 + (i - 16) * 1))
            b = max(0, min(255, 100 + (i - 16) * 2))
        elif i < 140:
            # Green gradients for Chaser
            r = max(0, min(255, 50 + (i - 80) * 1))
            g = max(0, min(255, 120 + (i - 80) * 2))
            b = max(0, min(255, 60 + (i - 80) * 1))
        elif i < 200:
            # Engine glow gradients (blue to cyan)
            val = (i - 140) * 4
            r = max(0, min(255, 50 + val // 5))
            g = max(0, min(255, 100 + val // 3))
            b = max(0, min(255, 200 + val // 2))
        else:
            # Special colors for highlights and effects
            val = (i - 200) * 4
            r = max(0, min(255, 200 + val // 3))
            g = max(0, min(255, 150 + val // 4))
            b = max(0, min(255, 100 + val // 5))
        
        palette.append((r, g, b))
    
    return palette

def draw_zapper_frame(draw, frame_num, width=32, height=32):
    """Draw a single frame of the Zapper enemy animation.
    Zapper: Small, fast, fires single shots - angular design."""
    
    # Clear the frame
    draw.rectangle([0, 0, width-1, height-1], fill=0)
    
    # Zapper body - angular, aggressive design
    # Frame 0: neutral position
    # Frame 1: wings slightly up
    # Frame 2: wings slightly down
    wing_offset = [0, -1, 1][frame_num % 3]
    
    body_points = [
        (width//2, 8),                    # Top point (nose)
        (width//2 - 6, 12 + wing_offset), # Left wing front
        (width//2 - 10, 20),              # Left wing middle
        (width//2 - 4, 24),               # Left wing rear
        (width//2 - 2, height-4),         # Left engine
        (width//2 + 2, height-4),         # Right engine
        (width//2 + 4, 24),               # Right wing rear
        (width//2 + 10, 20),              # Right wing middle
        (width//2 + 6, 12 - wing_offset), # Right wing front
    ]
    
    # Draw Zapper body with purple/red colors
    draw.polygon(body_points, fill=13)  # Light magenta
    
    # Add darker outline
    for i in range(len(body_points)):
        x1, y1 = body_points[i]
        x2, y2 = body_points[(i + 1) % len(body_points)]
        draw.line([x1, y1, x2, y2], fill=5, width=1)  # Magenta outline
    
    # Add cockpit/sensor
    sensor_center = (width//2, 14)
    sensor_radius = 3
    draw.ellipse([sensor_center[0] - sensor_radius, sensor_center[1] - sensor_radius,
                  sensor_center[0] + sensor_radius, sensor_center[1] + sensor_radius],
                 fill=4)  # Red
    
    # Add sensor highlight
    draw.ellipse([sensor_center[0] - 1, sensor_center[1] - 1,
                  sensor_center[0] + 1, sensor_center[1] + 1],
                 fill=12)  # Light red
    
    # Add weapon barrel (front)
    draw.rectangle([width//2 - 1, 4, width//2 + 1, 7], fill=12)  # Light red
    
    # Add engine glow
    engine_glow_intensity = [0.5, 0.8, 0.5][frame_num % 3]
    
    # Left engine glow
    left_engine_center = (width//2 - 2, height - 6)
    left_glow_radius = int(3 * engine_glow_intensity)
    for r in range(left_glow_radius, 0, -1):
        color_idx = 140 + int(30 * (r / left_glow_radius))  # Blue-cyan gradient
        draw.ellipse([left_engine_center[0] - r, left_engine_center[1] - r,
                      left_engine_center[0] + r, left_engine_center[1] + r],
                     fill=color_idx)
    
    # Right engine glow
    right_engine_center = (width//2 + 2, height - 6)
    right_glow_radius = int(3 * engine_glow_intensity)
    for r in range(right_glow_radius, 0, -1):
        color_idx = 140 + int(30 * (r / right_glow_radius))  # Blue-cyan gradient
        draw.ellipse([right_engine_center[0] - r, right_engine_center[1] - r,
                      right_engine_center[0] + r, right_engine_center[1] + r],
                     fill=color_idx)
    
    # Add wing details
    draw.line([width//2 - 6, 12 + wing_offset, width//2 - 4, 24], fill=15, width=1)  # White
    draw.line([width//2 + 6, 12 - wing_offset, width//2 + 4, 24], fill=15, width=1)  # White
    
    # Add some "pixel art" details
    draw.point([width//2 - 9, 21], fill=15)  # Wing tip highlight
    draw.point([width//2 + 9, 21], fill=15)  # Wing tip highlight

def draw_chaser_frame(draw, frame_num, width=32, height=32):
    """Draw a single frame of the Chaser enemy animation.
    Chaser: Fast, follows player - rounded/organic design."""
    
    # Clear the frame
    draw.rectangle([0, 0, width-1, height-1], fill=0)
    
    # Chaser body - rounded, organic design
    # Frame 0: neutral position
    # Frame 1: slightly compressed vertically
    # Frame 2: slightly expanded vertically
    scale_y = [1.0, 0.95, 1.05][frame_num % 3]
    
    # Main body (ellipse)
    body_center = (width//2, height//2)
    body_width = 14
    body_height = int(12 * scale_y)
    
    draw.ellipse([body_center[0] - body_width//2, body_center[1] - body_height//2,
                  body_center[0] + body_width//2, body_center[1] + body_height//2],
                 fill=10)  # Light green
    
    # Add darker outline
    draw.ellipse([body_center[0] - body_width//2, body_center[1] - body_height//2,
                  body_center[0] + body_width//2, body_center[1] + body_height//2],
                 outline=2, width=1)  # Green outline
    
    # Add "eye" sensor (front)
    eye_center = (width//2, height//2 - 2)
    eye_radius = 3
    draw.ellipse([eye_center[0] - eye_radius, eye_center[1] - eye_radius,
                  eye_center[0] + eye_radius, eye_center[1] + eye_radius],
                 fill=11)  # Light cyan
    
    # Add pupil/iris
    pupil_offset = [-1, 0, 1][frame_num % 3]  # Eye follows player
    draw.ellipse([eye_center[0] - 1 + pupil_offset, eye_center[1] - 1,
                  eye_center[0] + 1 + pupil_offset, eye_center[1] + 1],
                 fill=1)  # Blue
    
    # Add engine pods (rear)
    engine_y_offset = [0, 1, -1][frame_num % 3]
    
    # Left engine pod
    left_engine_center = (width//2 - 6, height//2 + 4 + engine_y_offset)
    draw.ellipse([left_engine_center[0] - 3, left_engine_center[1] - 3,
                  left_engine_center[0] + 3, left_engine_center[1] + 3],
                 fill=8)  # Dark gray
    
    # Right engine pod
    right_engine_center = (width//2 + 6, height//2 + 4 + engine_y_offset)
    draw.ellipse([right_engine_center[0] - 3, right_engine_center[1] - 3,
                  right_engine_center[0] + 3, right_engine_center[1] + 3],
                 fill=8)  # Dark gray
    
    # Add engine glow
    engine_glow_intensity = [0.6, 0.9, 0.6][frame_num % 3]
    
    # Left engine glow
    left_glow_radius = int(4 * engine_glow_intensity)
    for r in range(left_glow_radius, 0, -1):
        color_idx = 140 + int(40 * (r / left_glow_radius))  # Blue-cyan gradient
        draw.ellipse([left_engine_center[0] - r, left_engine_center[1] - r,
                      left_engine_center[0] + r, left_engine_center[1] + r],
                     fill=color_idx)
    
    # Right engine glow
    right_glow_radius = int(4 * engine_glow_intensity)
    for r in range(right_glow_radius, 0, -1):
        color_idx = 140 + int(40 * (r / right_glow_radius))  # Blue-cyan gradient
        draw.ellipse([right_engine_center[0] - r, right_engine_center[1] - r,
                      right_engine_center[0] + r, right_engine_center[1] + r],
                     fill=color_idx)
    
    # Add antennae/tentacles (organic feel)
    tentacle_wiggle = [0, 1, -1][frame_num % 3]
    
    # Left tentacle
    draw.line([width//2 - 7, height//2 - 1,
               width//2 - 10, height//2 - 4 + tentacle_wiggle],
              fill=10, width=1)  # Light green
    
    # Right tentacle
    draw.line([width//2 + 7, height//2 - 1,
               width//2 + 10, height//2 - 4 - tentacle_wiggle],
              fill=10, width=1)  # Light green
    
    # Add highlights
    draw.point([body_center[0] - 5, body_center[1] - 4], fill=15)  # Top left highlight
    draw.point([body_center[0] + 5, body_center[1] - 4], fill=15)  # Top right highlight

def apply_crt_filter(image):
    """Apply a simple CRT filter to simulate scanlines and pixel bleed."""
    width, height = image.size
    
    # Convert to RGB for processing
    rgb_image = image.convert('RGB')
    pixels = rgb_image.load()
    
    # Create new image for CRT effect
    crt_image = Image.new('RGB', (width, height))
    crt_pixels = crt_image.load()
    
    # Simple scanline effect (every other line slightly darker)
    for y in range(height):
        scanline_darken = 0.9 if y % 2 == 0 else 1.0
        
        for x in range(width):
            r, g, b = pixels[x, y]
            
            # Apply scanline effect
            r = int(r * scanline_darken)
            g = int(g * scanline_darken)
            b = int(b * scanline_darken)
            
            # Simple pixel bleed (blur horizontally)
            if x > 0:
                r2, g2, b2 = pixels[x-1, y]
                r = (r + r2 // 8) // 1
                g = (g + g2 // 8) // 1
                b = (b + b2 // 8) // 1
            
            crt_pixels[x, y] = (r, g, b)
    
    return crt_image

def create_enemy_sprite_sheet(enemy_type, draw_function):
    """Create a sprite sheet for an enemy type with 3 animation frames."""
    frame_width = 32
    frame_height = 32
    num_frames = 3
    
    # Create sprite sheet image
    sheet_width = frame_width * num_frames
    sheet_height = frame_height
    
    # Create palette
    palette = create_1990s_palette()
    
    # Create indexed color image
    sheet = Image.new('P', (sheet_width, sheet_height), 0)
    sheet.putpalette([c for rgb in palette for c in rgb])
    
    for frame in range(num_frames):
        # Create individual frame
        frame_img = Image.new('P', (frame_width, frame_height), 0)
        frame_img.putpalette([c for rgb in palette for c in rgb])
        draw = ImageDraw.Draw(frame_img)
        
        # Draw this frame
        draw_function(draw, frame, frame_width, frame_height)
        
        # Paste into sprite sheet
        sheet.paste(frame_img, (frame * frame_width, 0))
    
    return sheet

def main():
    print("Generating authentic 1990s enemy sprites...")
    
    # Create directories if they don't exist
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    images_dir = os.path.join(base_dir, 'assets', 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    # Generate Zapper enemy sprite sheet
    print("Generating Zapper enemy sprite...")
    zapper_sheet = create_enemy_sprite_sheet('zapper', draw_zapper_frame)
    zapper_path = os.path.join(images_dir, 'enemy_zapper.png')
    zapper_sheet.save(zapper_path, optimize=True)
    print(f"Saved Zapper sprite sheet to {zapper_path}")
    
    # Generate Chaser enemy sprite sheet
    print("Generating Chaser enemy sprite...")
    chaser_sheet = create_enemy_sprite_sheet('chaser', draw_ch