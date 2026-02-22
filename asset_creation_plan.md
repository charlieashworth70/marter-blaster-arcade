# MerterBlaster Asset Creation Plan

## Phase 1: Immediate Foundation (Week 1)

### Sprite Assets to Create
1. **Player Ship** (50×30 pixels)
   - 4-frame idle animation (engine glow)
   - 3-frame damage states
   - Explosion sequence (8 frames)

2. **Basic Enemies** (2 types, 40×30 pixels each)
   - Zapper: Simple drone with 3-frame movement
   - Chaser: Faster enemy with 4-frame movement
   - Each with hit sparks and explosion animations

3. **Weapon Effects**
   - Standard laser bolt (3×15 pixels, 2-frame animation)
   - Small explosion (20×20 pixels, 6-frame animation)
   - Hit sparks (various sizes, 4-frame animation)

4. **UI Elements**
   - Score font (8×8 pixel characters)
   - Life icons (16×16 pixels)
   - Health bar elements

### Sound Assets to Create
1. **Sound System Implementation**
   - Web Audio API integration
   - Audio loading and management
   - Volume controls and mixing

2. **Essential Sound Effects**
   - Laser shot (FM synthesis square wave)
   - Enemy hit (PSG noise burst)
   - Small explosion (mixed waveform)
   - Power-up collection (rising arpeggio)

3. **Background Music**
   - Level 1 theme (FM synthesis, 2-3 minutes)
   - Title screen music (shorter loop)

## Phase 2: Core Gameplay (Week 2)

### Additional Sprite Assets
1. **Remaining 5 Enemy Types**
   - Tanker (slow, heavy)
   - Sniper (long-range)
   - Bomber (area attack)
   - Swarmer (small, fast)
   - Carrier (spawns smaller enemies)

2. **Weapon Variety**
   - Spread shot
   - Homing missiles
   - Laser beam
   - Wave shot
   - Shield generator

3. **Power-up Icons**
   - Weapon power-ups (8 types)
   - Bomb power-ups (6 types)
   - Special meter items

### Additional Sound Assets
1. **Complete Sound Effect Set**
   - All weapon firing sounds
   - All enemy sounds
   - UI/menu sounds
   - Environmental sounds

2. **Additional Music Tracks**
   - Levels 2-4 music
   - Boss battle theme
   - Game over/continue music

## Phase 3: Advanced Content (Week 3-4)

### Boss & Advanced Sprites
1. **Boss Sprites** (Large, multi-part)
   - Volt-Cannon (Level 1 mid-boss)
   - Transmission Terror (Level 1 boss)
   - Additional bosses as development progresses

2. **Advanced Visual Effects**
   - Particle systems
   - Screen shake
   - Glow effects
   - Transition animations

3. **Background Elements**
   - Parallax layers for all levels
   - Animated environmental elements
   - Tile sets for platforms/obstacles

### Advanced Audio
1. **Voice Samples**
   - Digitized voice clips
   - Boss introductions
   - Warning announcements

2. **Complete Soundtrack**
   - All level music
   - Special mode music
   - Ending themes

## Technical Implementation Plan

### Sprite Creation Workflow
1. **Research & Reference** - Study 1990s arcade shooters
2. **Tool Setup** - Configure Aseprite/LibreSprite with constraints
3. **Asset Creation** - Create sprites following guidelines
4. **Animation** - Create frame-by-frame animations
5. **Export** - Save as PNG sprite sheets
6. **Integration** - Update game.js to use new sprites

### Sound Creation Workflow
1. **Research & Reference** - Study FM synthesis chips
2. **Tool Setup** - Configure Furnace Tracker/DefleMask
3. **Sound Design** - Create instruments and effects
4. **Composition** - Create music tracks
5. **Export** - Save as OGG/MP3 files
6. **Integration** - Implement audio system in game.js

## Quality Control Measures

### Sprite Quality Checklist
- [ ] 256-color palette maximum
- [ ] Manual anti-aliasing applied
- [ ] CRT-aware design considerations
- [ ] Smooth animation (appropriate frame count)
- [ ] Clear visual communication
- [ ] Memory efficient (optimized sprite sheets)

### Sound Quality Checklist
- [ ] FM synthesis/PSG style achieved
- [ ] Clear, distinct sounds
- [ ] Proper volume balancing
- [ ] Performance optimized
- [ ] Authentic 1990s character

## Integration Testing

### Visual Integration Tests
1. **Sprite loading test** - Verify all sprites load correctly
2. **Animation test** - Verify smooth animation playback
3. **Performance test** - Verify 60 FPS with all sprites
4. **Resolution test** - Verify clarity at 320×240

### Audio Integration Tests
1. **Audio loading test** - Verify all sounds load correctly
2. **Playback test** - Verify simultaneous sound playback
3. **Performance test** - Verify no audio lag
4. **Mix test** - Verify proper volume balance

## Success Metrics

### Visual Success Metrics
- All sprites load and display correctly
- Animations play smoothly at 60 FPS
- Game maintains target resolution (320×240)
- CRT filter enhances rather than distorts
- Memory usage within acceptable limits

### Audio Success Metrics
- All sounds play correctly without lag
- Music loops seamlessly
- Volume levels appropriate for all sounds
- Authentic 1990s sound character achieved
- Performance impact minimal

## Risk Mitigation

### Visual Risks & Mitigation
- **Risk**: Inconsistent art style
  - **Mitigation**: Establish style guide early, single artist per category
- **Risk**: Performance issues with many sprites
  - **Mitigation**: Optimize sprite sheets, implement culling
- **Risk**: Poor CRT filter appearance
  - **Mitigation**: Test assets with filter during creation

### Audio Risks & Mitigation
- **Risk**: Inauthentic sound design
  - **Mitigation**: Study reference material, use period tools
- **Risk**: Audio performance issues
  - **Mitigation**: Optimize file sizes, implement pooling
- **Risk**: Poor mixing balance
  - **Mitigation**: Test with multiple volume levels, get feedback

## Delivery Schedule

### Week 1 Deliverables
- Player ship sprite with animation
- 2 enemy sprites with animations
- Basic weapon effect sprites
- Sound system implementation
- Essential sound effects
- Level 1 background music

### Week 2 Deliverables
- All 7 enemy sprites
- All weapon effect sprites
- Complete sound effect set
- Additional music tracks
- UI sprite elements

### Week 3-4 Deliverables
- Boss sprites (as needed)
- Advanced visual effects
- Complete music soundtrack
- Voice samples
- Final integration and polish

This plan provides a structured approach to creating all necessary assets while maintaining 1990s authenticity and quality standards.