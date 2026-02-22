# Development Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup
```bash
# Clone repository
git clone https://github.com/[your-username]/merterblaster.git
cd merterblaster

# Install dependencies
npm install

# Start development server
npm start
# or with live reload
npm run dev
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-enemy-type

# Make changes
# Test changes
npm test

# Commit changes
git add .
git commit -m "feat: Add new enemy type with zigzag pattern"

# Push to GitHub
git push origin feature/new-enemy-type

# Create Pull Request on GitHub
```

### 2. Bug Fixes
```bash
# Create bugfix branch
git checkout -b fix/collision-detection-issue

# Fix the bug
# Add test to prevent regression
npm test

# Commit fix
git commit -m "fix: Correct collision detection for diagonal movement"

# Push and create PR
```

## Code Organization

### Game Structure
```
game.js
├── Constants & Configuration
├── Game State Management
├── Entity Definitions
│   ├── Player
│   ├── Enemies
│   ├── Projectiles
│   └── Power-ups
├── Game Loop Functions
│   ├── update()
│   ├── render()
│   └── gameLoop()
├── Input Handling
├── Collision Detection
├── Audio Management
└── Utility Functions
```

### Adding New Features

#### 1. New Enemy Type
```javascript
// 1. Define enemy properties
const newEnemy = {
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  speed: 2,
  color: '#ff9900',
  pattern: 'zigzag',  // Custom movement pattern
  health: 3,
  score: 200
};

// 2. Add to enemies array
enemies.push(newEnemy);

// 3. Implement custom update logic
function updateNewEnemy(enemy, deltaTime) {
  // Custom movement pattern
  enemy.x += Math.sin(enemy.y * 0.1) * enemy.speed;
  enemy.y += enemy.speed;
  
  // Boundary checking
  if (enemy.y > canvas.height) {
    enemy.y = -enemy.height;
  }
}
```

#### 2. New Power-up
```javascript
// 1. Define power-up type
const PowerUpType = {
  SHIELD: 'shield',
  RAPID_FIRE: 'rapid_fire',
  SPREAD_SHOT: 'spread_shot',
  // Add new type
  TIME_SLOW: 'time_slow'
};

// 2. Create power-up object
const timeSlowPowerUp = {
  x: 300,
  y: 200,
  width: 30,
  height: 30,
  type: PowerUpType.TIME_SLOW,
  duration: 5000,  // 5 seconds
  color: '#00ffff',
  active: false
};

// 3. Implement effect
function activateTimeSlow() {
  gameTimeScale = 0.5;  // Slow down time
  setTimeout(() => {
    gameTimeScale = 1.0;  // Restore normal time
  }, 5000);
}
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/game.test.js

# Run with coverage
npm test -- --coverage
```

### Writing Tests
```javascript
// Example test for new feature
describe('Time Slow Power-up', () => {
  test('should slow down game time when activated', () => {
    const game = new Game();
    game.activatePowerUp('time_slow');
    
    expect(game.timeScale).toBe(0.5);
  });
  
  test('should restore normal time after duration', async () => {
    const game = new Game();
    game.activatePowerUp('time_slow');
    
    // Wait for duration + buffer
    await new Promise(resolve => setTimeout(resolve, 5100));
    
    expect(game.timeScale).toBe(1.0);
  });
});
```

## Performance Optimization

### 1. Rendering Optimizations
```javascript
// Use object pooling for frequently created/destroyed objects
const laserPool = {
  pool: [],
  get: function() {
    return this.pool.pop() || { x: 0, y: 0, width: 5, height: 15, active: false };
  },
  release: function(laser) {
    laser.active = false;
    this.pool.push(laser);
  }
};

// Batch similar draw calls
function renderEnemies() {
  ctx.fillStyle = '#ff00ea';
  enemies.forEach(enemy => {
    if (enemy.alive) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}
```

### 2. Memory Management
```javascript
// Clean up unused objects
function cleanup() {
  // Remove inactive lasers
  player.lasers = player.lasers.filter(laser => laser.active);
  
  // Remove dead enemies
  enemies = enemies.filter(enemy => enemy.alive);
  
  // Clear particle effects that have expired
  particles = particles.filter(particle => particle.life > 0);
}
```

### 3. Asset Loading
```javascript
// Preload critical assets
const assets = {
  images: {},
  sounds: {},
  loaded: 0,
  total: 0
};

function preloadAssets() {
  const imageUrls = [
    'assets/images/player.png',
    'assets/images/enemy.png',
    'assets/images/explosion.png'
  ];
  
  assets.total = imageUrls.length;
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.onload = () => {
      assets.loaded++;
      assets.images[url] = img;
      updateLoadingProgress();
    };
    img.src = url;
  });
}
```

## Debugging

### Browser DevTools
```javascript
// Add debug helpers
window.debug = {
  showHitboxes: false,
  infiniteLives: false,
  godMode: false,
  
  toggleHitboxes: function() {
    this.showHitboxes = !this.showHitboxes;
    console.log('Hitboxes:', this.showHitboxes ? 'ON' : 'OFF');
  },
  
  // Add to game render
  renderDebug: function() {
    if (this.showHitboxes) {
      ctx.strokeStyle = 'red';
      // Draw hitboxes for all entities
    }
  }
};

// Access from console
// debug.toggleHitboxes()
// debug.infiniteLives = true
```

### Performance Monitoring
```javascript
// Frame rate monitoring
let frameCount = 0;
let lastFpsUpdate = 0;
let fps = 0;

function updateFPS(timestamp) {
  frameCount++;
  
  if (timestamp >= lastFpsUpdate + 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsUpdate = timestamp;
    
    // Log if FPS drops below threshold
    if (fps < 50) {
      console.warn(`Low FPS: ${fps}`);
    }
  }
}
```

## Mobile Development

### Touch Controls
```javascript
// Touch event handling
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(event) {
  event.preventDefault();
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

// Virtual joystick implementation
class VirtualJoystick {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.radius = 50;
  }
  
  update(touchX, touchY) {
    // Calculate movement vector
    const dx = touchX - this.x;
    const dy = touchY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize if outside radius
    if (distance > this.radius) {
      this.x += (dx / distance) * this.radius;
      this.y += (dy / distance) * this.radius;
    } else {
      this.x = touchX;
      this.y = touchY;
    }
    
    return { x: dx / this.radius, y: dy / this.radius };
  }
}
```

### Mobile Performance
```javascript
// Optimize for mobile
function optimizeForMobile() {
  // Reduce particle count on mobile
  if (isMobile) {
    maxParticles = 50;
    enemyCount = 20;
  }
  
  // Use simpler effects
  if (isLowEndDevice) {
    disableCRTEffect = true;
    simpleExplosions = true;
  }
}
```

## Deployment

### Local Testing
```bash
# Test PWA features
npm start
# Open http://localhost:3000

# Test on different devices
# Use browser devtools device emulation
# Or connect real devices on same network
```

### Production Build
```bash
# The game is static, no build step required
# But you can optimize assets:
npm run optimize-assets

# Deploy to GitHub Pages
npm run deploy
```

### Monitoring Deployment
1. Check GitHub Actions workflow runs
2. Verify GitHub Pages deployment
3. Test live site on multiple devices
4. Monitor console for errors
5. Check PWA installation

## Troubleshooting

### Common Issues

#### 1. Game Not Loading
- Check browser console for errors
- Verify all files are served correctly
- Check service worker registration

#### 2. Performance Issues
- Reduce particle count
- Simplify visual effects
- Implement object pooling
- Use requestAnimationFrame properly

#### 3. Touch Controls Not Working
- Check touch event listeners
- Test on real mobile device
- Ensure viewport meta tag is set

#### 4. Audio Not Playing
- Check browser autoplay policies
- Ensure audio files are loaded
- Use Web Audio API correctly

### Getting Help
1. Check existing issues on GitHub
2. Search closed issues for similar problems
3. Create new issue with detailed information
4. Include browser console output
5. Provide steps to reproduce

---

Remember: Test early, test often, and test on real devices! 🎮