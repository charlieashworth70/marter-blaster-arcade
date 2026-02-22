#!/usr/bin/env python3
"""
Generate authentic 1990s pixel art player ship sprite for MerterBlaster.
Creates a 50x30 pixel sprite with 4-frame idle animation showing engine glow.
Uses 256-color palette maximum with manual anti-aliasing and CRT-aware design.
"""

from PIL import Image, ImageDraw
import math

# Define authentic 1990s color palette (256 colors max)
# Based on VGA 256-color palette with some adjustments for CRT display
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
    # Create gradients for ship colors (blues, grays, engine glow)
    for i in range(16, 256):
        if i < 80:
            # Blue gradients for ship body
            r = max(0, min(255, 30 + (i - 16) * 2))
            g = max(0, min(255, 40 + (i - 16) * 2))
            b = max(0, min(255, 100 + (i - 16) * 1))
        elif i < 140:
            # Gray gradients for metal parts
            val = 50 + (i - 80) * 2
            r = g = b = max(0, min(255, val))
        elif i < 200:
            # Engine glow gradients (yellow to orange to red)
            val = (i - 140) * 4
            r = max(0, min(255, 200 + val // 3))
            g = max(0, min(255, 150 + val // 4))
            b = max(0, min(255, 50 - val // 5))
        else:
            # Special colors for highlights and effects
            val = (i - 200) * 4
            r = max(0, min(255, 150 + val // 2))
            g = max(0, min(255, 200 + val // 3))
            b = max(0, min(255, 255 - val // 4))
        
        palette.append((r, g, b))
    
    return palette

def draw_player_ship_frame(draw, frame_num, width=50, height=30):
    """Draw a single frame of the player ship animation."""
    # Clear the frame
    draw.rectangle([0, 0, width-1, height-1], fill=0)
    
    # Ship body (main fuselage) - symmetrical design
    body_points = [
        (width//2, 5),           # Top center (nose)
        (width//2 - 10, 15),     # Left wing front
        (width//2 - 15, 20),     # Left wing middle
        (width//2 - 8, 25),      # Left wing rear
        (width//2 - 5, height-1), # Left engine bottom
        (width//2 + 5, height-1), # Right engine bottom
        (width//2 + 8, 25),      # Right wing rear
        (width//2 + 15, 20),     # Right wing middle
        (width//2 + 10, 15),     # Right wing front
    ]
    
    # Draw ship body with manual anti-aliasing
    draw.polygon(body_points, fill=9)  # Light blue main color
    
    # Add darker outline for depth (selective outlining)
    for i in range(len(body_points)):
        x1, y1 = body_points[i]
        x2, y2 = body_points[(i + 1) % len(body_points)]
        draw.line([x1, y1, x2, y2], fill=1, width=1)  # Dark blue outline
    
    # Add cockpit/canopy
    cockpit_center = (width//2, 10)
    cockpit_radius = 4
    draw.ellipse([cockpit_center[0] - cockpit_radius, cockpit_center[1] - cockpit_radius,
                  cockpit_center[0] + cockpit_radius, cockpit_center[1] + cockpit_radius],
                 fill=11)  # Light cyan
    
    # Add cockpit highlight
    draw.ellipse([cockpit_center[0] - 2, cockpit_center[1] - 2,
                  cockpit_center[0] + 1, cockpit_center[1] + 1],
                 fill=15)  # White highlight
    
    # Add engine glow animation (4 frames)
    engine_glow_intensity = [0.3, 0.6, 1.0, 0.6][frame_num]
    
    # Left engine glow
    left_engine_center = (width//2 - 2, height - 5)
    left_glow_radius = int(5 * engine_glow_intensity)
    for r in range(left_glow_radius, 0, -1):
        alpha = int(200 * (r / left_glow_radius) * engine_glow_intensity)
        color_idx = 140 + int(40 * (r / left_glow_radius))  # Yellow-orange-red gradient
        draw.ellipse([left_engine_center[0] - r, left_engine_center[1] - r,
                      left_engine_center[0] + r, left_engine_center[1] + r],
                     fill=color_idx)
    
    # Right engine glow
    right_engine_center = (width//2 + 2, height - 5)
    right_glow_radius = int(5 * engine_glow_intensity)
    for r in range(right_glow_radius, 0, -1):
        alpha = int(200 * (r / right_glow_radius) * engine_glow_intensity)
        color_idx = 140 + int(40 * (r / right_glow_radius))  # Yellow-orange-red gradient
        draw.ellipse([right_engine_center[0] - r, right_engine_center[1] - r,
                      right_engine_center[0] + r, right_engine_center[1] + r],
                     fill=color_idx)
    
    # Add metallic details and highlights
    # Wing details
    draw.line([width//2 - 10, 15, width//2 - 8, 25], fill=7, width=1)  # Light gray
    draw.line([width//2 + 10, 15, width//2 + 8, 25], fill=7, width=1)  # Light gray
    
    # Nose detail
    draw.line([width//2, 5, width//2, 8], fill=15, width=1)  # White
    
    # Add some "pixel art" details (manual anti-aliasing)
    # Wing edge highlights
    draw.point([width//2 - 9, 16], fill=15)
    draw.point([width//2 + 9, 16], fill=15)
    draw.point([width//2 - 14, 21], fill=15)
    draw.point([width//2 + 14, 21], fill=15)
    
    # Engine housing
    draw.rectangle([width//2 - 6, height-3, width//2 - 4, height-1], fill=8)  # Dark gray
    draw.rectangle([width//2 + 4, height-3, width//2 + 6, height-1], fill=8)  # Dark gray

def create_sprite_sheet():
    """Create a sprite sheet with 4 animation frames."""
    frame_width = 50
    frame_height = 30
    num_frames = 4
    
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
        draw_player_ship_frame(draw, frame, frame_width, frame_height)
        
        # Paste into sprite sheet
        sheet.paste(frame_img, (frame * frame_width, 0))
    
    return sheet

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

def main():
    print("Generating authentic 1990s player ship sprite...")
    
    # Create directories if they don't exist
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    images_dir = os.path.join(base_dir, 'assets', 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    # Create sprite sheet
    sprite_sheet = create_sprite_sheet()
    
    # Save original (for game use)
    player_path = os.path.join(images_dir, 'player.png')
    sprite_sheet.save(player_path, optimize=True)
    print(f"Saved sprite sheet to {player_path}")
    
    # Create CRT-filtered version for reference
    crt_version = apply_crt_filter(sprite_sheet)
    crt_preview_path = os.path.join(images_dir, 'player_crt_preview.png')
    crt_version.save(crt_preview_path)
    print(f"Saved CRT preview to {crt_preview_path}")
    
    # Also save individual frames for reference
    for frame in range(4):
        frame_img = sprite_sheet.crop((frame * 50, 0, (frame + 1) * 50, 30))
        frame_path = os.path.join(images_dir, f'player_frame_{frame}.png')
        frame_img.save(frame_path)
    
    print("Player ship sprite generation complete!")
    print(f"Sprite sheet: 200x30 pixels (4 frames of 50x30)")
    print(f"Color palette: 256 colors maximum")
    print(f"Animation: 4-frame engine glow idle animation")

if __name__ == "__main__":
    main()