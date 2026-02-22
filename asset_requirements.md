# MerterBlaster Asset Requirements

## Sprite Animations Required

### Player Ship
1. **Base ship** (idle animation - subtle engine glow)
2. **Ship with different weapon attachments** (for each of 8 weapons)
3. **Damage states** (3 levels of damage visual)
4. **Explosion animation** (player death)
5. **Special attack charge/activation** animations

### Basic Enemies (7 types)
For each enemy type:
1. **Idle/movement animation**
2. **Attack animation** (firing weapons)
3. **Damage states** (hit sparks, damage visual)
4. **Explosion animation** (death)

### Boss Sprites (8 stage bosses + final boss)
For each boss:
1. **Multiple parts** (large bosses may have separate sprite sections)
2. **Phase transition animations** (3 phases each)
3. **Attack pattern animations**
4. **Damage visual effects**
5. **Death/explosion sequence** (multi-frame)

### Weapons & Effects
1. **Bullet sprites** (for all weapon types)
2. **Laser beams** (various colors/thickness)
3. **Missile trails**
4. **Explosion effects** (small, medium, large)
5. **Hit sparks** (enemy/player hit)
6. **Power-up icons** (8 types + levels)
7. **Bomb effects** (6 types)
8. **Special meter effects** (charge, activation)

### UI Elements
1. **Health bars** (player, boss)
2. **Weapon icons**
3. **Score numbers** (pixel font)
4. **Life counter icons**
5. **Menu elements** (buttons, selections)
6. **High score table**

### Background Elements
1. **Parallax layers** (for each of 8 levels)
2. **Tile sets** (for level-specific platforms/obstacles)
3. **Environmental hazards** (fire, water, radiation, etc.)
4. **Animated background elements** (spinning turbines, flowing water, etc.)

## Sound Assets Required

### Weapon Sounds
1. **Primary weapon firing sounds** (8 types × 3 levels)
2. **Secondary bomb sounds** (6 types)
3. **Special attack sounds** (charge, activation, firing)
4. **Laser charging/beam sounds**

### Enemy Sounds
1. **Enemy spawn sounds** (7 types)
2. **Enemy firing sounds** (various patterns)
3. **Enemy hit sounds** (different for each enemy type)
4. **Enemy explosion sounds** (small, medium, large)

### Player Sounds
1. **Ship movement** (subtle engine hum)
2. **Damage taken** (shield hit, critical damage)
3. **Player explosion** (death)
4. **Power-up collection** (different sounds for each type)
5. **Weapon switch/upgrade**

### Boss Sounds
1. **Boss entrance/intro** (dramatic)
2. **Boss attack sounds** (unique for each boss)
3. **Boss phase transition** (dramatic shift)
4. **Boss damage sounds**
5. **Boss defeat/explosion**

### UI & Menu Sounds
1. **Menu navigation** (select, confirm, back)
2. **Game start/continue**
3. **High score entry** (typing sounds)
4. **Pause/unpause**

### Voice Samples (digitized)
1. **"Warning!"** (boss approaching)
2. **"Boss!"** (boss appears)
3. **"Get Ready!"** (level start)
4. **"Game Over"**
5. **"Continue?"** (with countdown)
6. **"Player 1/2"** (game start)
7. **"High Score!"**

### Music Tracks
1. **Title screen music**
2. **Level 1-8 music** (each with unique theme)
3. **Boss battle music** (intense variation)
4. **Game over/continue music**
5. **High score/ending music**
6. **Menu music**

## Technical Specifications

### Sprite Specifications
- **Resolution**: 320×240 target (scalable to 640×480)
- **Color palette**: 256 colors maximum per screen
- **Animation frames**: 2-8 frames per animation (memory conscious)
- **File format**: PNG with transparency
- **Sprite sheets**: Organized by type/category

### Sound Specifications
- **Format**: OGG/Vorbis for web, WAV for source
- **Sample rate**: 22050Hz or 44100Hz
- **Bit depth**: 16-bit
- **FM synthesis emulation**: Yamaha YM2151/YM2612 style
- **PSG effects**: SN76489 style for simple effects

### Authenticity Requirements
1. **Pixel art**: Manual anti-aliasing, limited palettes, CRT-aware design
2. **Animation**: Smooth but limited frames (2-8), sub-pixel movement
3. **Sound**: FM synthesis programming, tracker-style composition
4. **Memory constraints**: Consider 4MB ROM limit for arcade version

## Priority Order

### Phase 1 (MVP - First Playable)
1. Player ship (basic)
2. 2 basic enemy types
3. Basic weapon sprites (laser, missile)
4. Explosion effects (small, medium)
5. Essential sounds (shooting, explosions, hits)
6. Level 1 background

### Phase 2 (Core Game)
1. All 7 enemy types
2. All 8 weapons
3. Boss sprites (first 2 bosses)
4. Complete sound set for core gameplay
5. Levels 1-4 backgrounds

### Phase 3 (Complete)
1. All bosses (8 + final)
2. All UI elements
3. All sound effects and music
4. All background elements
5. Polish/optimization pass