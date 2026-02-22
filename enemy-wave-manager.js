// Enemy Wave Manager - R-Type Style Enemy Patterns
// Manages enemy waves, formations, and movement patterns

export class EnemyWaveManager {
  constructor(game) {
    this.game = game;
    this.currentWave = 0;
    this.waves = [];
    this.activeEnemies = [];
    this.explosions = [];
    this.waveComplete = false;
    this.waveTimer = 0;
    this.spawnTimer = 0;
    
    // Define enemy types
    this.enemyTypes = {
      SCOUT: {
        width: 24,
        height: 16,
        color: '#ff00ea',
        health: 1,
        score: 100,
        speed: 2.5,
        pattern: 'swoop'
      },
      FIGHTER: {
        width: 32,
        height: 24,
        color: '#ff5500',
        health: 2,
        score: 200,
        speed: 2.0,
        pattern: 'zigzag'
      },
      BOMBER: {
        width: 40,
        height: 32,
        color: '#ff0000',
        health: 3,
        score: 300,
        speed: 1.5,
        pattern: 'straight'
      },
      INTERCEPTOR: {
        width: 28,
        height: 20,
        color: '#00ffff',
        health: 1,
        score: 150,
        speed: 3.0,
        pattern: 'circle'
      }
    };
    
    // Initialize waves
    this.initializeWaves();
  }
  
  initializeWaves() {
    // Wave 1: Basic scout formation
    this.waves.push({
      enemies: [
        { type: 'SCOUT', count: 8, formation: 'line', delay: 0, x: 100, y: -50 },
        { type: 'SCOUT', count: 8, formation: 'line', delay: 60, x: 300, y: -50 },
        { type: 'SCOUT', count: 8, formation: 'line', delay: 120, x: 500, y: -50 }
      ],
      completeDelay: 180
    });
    
    // Wave 2: Mixed formation with fighters
    this.waves.push({
      enemies: [
        { type: 'SCOUT', count: 6, formation: 'v', delay: 0, x: 200, y: -50 },
        { type: 'FIGHTER', count: 4, formation: 'line', delay: 90, x: 400, y: -50 },
        { type: 'SCOUT', count: 6, formation: 'v', delay: 180, x: 600, y: -50 }
      ],
      completeDelay: 240
    });
    
    // Wave 3: Interceptor swarm
    this.waves.push({
      enemies: [
        { type: 'INTERCEPTOR', count: 12, formation: 'swarm', delay: 0, x: 400, y: -50 },
        { type: 'FIGHTER', count: 6, formation: 'zigzag', delay: 120, x: 200, y: -50 }
      ],
      completeDelay: 300
    });
    
    // Wave 4: Bomber wave
    this.waves.push({
      enemies: [
        { type: 'BOMBER', count: 3, formation: 'line', delay: 0, x: 150, y: -100 },
        { type: 'BOMBER', count: 3, formation: 'line', delay: 90, x: 450, y: -100 },
        { type: 'SCOUT', count: 10, formation: 'swarm', delay: 180, x: 400, y: -50 }
      ],
      completeDelay: 300
    });
  }
  
  startWave(waveIndex = 0) {
    if (waveIndex >= this.waves.length) {
      // All waves complete - loop or end
      this.currentWave = 0;
      waveIndex = 0;
    }
    
    this.currentWave = waveIndex;
    this.waveComplete = false;
    this.waveTimer = 0;
    this.spawnTimer = 0;
    this.activeEnemies = [];
    
    console.log(`Starting wave ${this.currentWave + 1}`);
  }
  
  update(deltaTime) {
    if (this.waveComplete) return;
    
    this.waveTimer += deltaTime;
    
    const wave = this.waves[this.currentWave];
    
    // Spawn enemies based on wave definition
    wave.enemies.forEach(enemyGroup => {
      if (this.waveTimer >= enemyGroup.delay && !enemyGroup.spawned) {
        this.spawnEnemyGroup(enemyGroup);
        enemyGroup.spawned = true;
      }
    });
    
    // Update all active enemies
    for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
      const enemy = this.activeEnemies[i];
      
      if (!enemy.alive) {
        // Remove dead enemies
        this.activeEnemies.splice(i, 1);
        continue;
      }
      
      this.updateEnemy(enemy, deltaTime);
      
      // Check if enemy is off screen
      if (this.isOffScreen(enemy)) {
        this.activeEnemies.splice(i, 1);
        continue;
      }
    }
    
    // Update explosions
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      explosion.lifetime -= deltaTime;
      
      if (explosion.lifetime <= 0) {
        this.explosions.splice(i, 1);
      }
    }
    
    // Check if wave is complete
    if (this.waveTimer >= wave.completeDelay && this.activeEnemies.length === 0) {
      this.waveComplete = true;
      console.log(`Wave ${this.currentWave + 1} complete!`);
    }
  }
  
  spawnEnemyGroup(group) {
    const enemyType = this.enemyTypes[group.type];
    
    for (let i = 0; i < group.count; i++) {
      const enemy = this.createEnemy(enemyType, group, i);
      this.activeEnemies.push(enemy);
    }
  }
  
  createEnemy(enemyType, group, index) {
    let x, y;
    
    // Calculate position based on formation
    switch (group.formation) {
      case 'line':
        x = group.x + (index * 60);
        y = group.y;
        break;
      case 'v':
        x = group.x + ((index - Math.floor(group.count / 2)) * 40);
        y = group.y + Math.abs(index - Math.floor(group.count / 2)) * 20;
        break;
      case 'swarm':
        x = group.x + (Math.random() * 200 - 100);
        y = group.y + (Math.random() * 50);
        break;
      case 'zigzag':
        x = group.x + (index * 50);
        y = group.y + (index % 2 === 0 ? 0 : 30);
        break;
      default:
        x = group.x;
        y = group.y;
    }
    
    return {
      x: x,
      y: y,
      width: enemyType.width,
      height: enemyType.height,
      color: enemyType.color,
      health: enemyType.health,
      maxHealth: enemyType.health,
      score: enemyType.score,
      speed: enemyType.speed,
      pattern: enemyType.pattern,
      alive: true,
      patternTimer: 0,
      // Pattern-specific properties
      patternOffset: Math.random() * Math.PI * 2,
      direction: 1,
      baseX: x,
      baseY: y
    };
  }
  
  updateEnemy(enemy, deltaTime) {
    enemy.patternTimer += deltaTime;
    
    // Apply movement pattern
    switch (enemy.pattern) {
      case 'swoop':
        this.updateSwoopPattern(enemy, deltaTime);
        break;
      case 'zigzag':
        this.updateZigzagPattern(enemy, deltaTime);
        break;
      case 'straight':
        this.updateStraightPattern(enemy, deltaTime);
        break;
      case 'circle':
        this.updateCirclePattern(enemy, deltaTime);
        break;
      default:
        this.updateStraightPattern(enemy, deltaTime);
    }
    
    // Move downward
    enemy.y += enemy.speed * deltaTime;
  }
  
  updateSwoopPattern(enemy, deltaTime) {
    // Swoop side to side
    const amplitude = 100;
    const frequency = 0.02;
    
    enemy.x = enemy.baseX + Math.sin(enemy.patternTimer * frequency + enemy.patternOffset) * amplitude;
  }
  
  updateZigzagPattern(enemy, deltaTime) {
    // Zigzag movement
    const amplitude = 80;
    const frequency = 0.03;
    
    enemy.x = enemy.baseX + Math.sin(enemy.patternTimer * frequency * 2 + enemy.patternOffset) * amplitude;
  }
  
  updateStraightPattern(enemy, deltaTime) {
    // Straight down with slight drift
    const drift = Math.sin(enemy.patternTimer * 0.01) * 0.5;
    enemy.x += drift;
  }
  
  updateCirclePattern(enemy, deltaTime) {
    // Circular movement
    const radius = 60;
    const speed = 0.04;
    
    enemy.x = enemy.baseX + Math.cos(enemy.patternTimer * speed + enemy.patternOffset) * radius;
    enemy.y = enemy.baseY + Math.sin(enemy.patternTimer * speed + enemy.patternOffset) * radius;
  }
  
  isOffScreen(enemy) {
    return enemy.y > this.game.canvas.height + 100 ||
           enemy.x < -100 ||
           enemy.x > this.game.canvas.width + 100;
  }
  
  draw(ctx) {
    // Draw explosions first (so they appear behind enemies)
    this.explosions.forEach(explosion => {
      const alpha = explosion.lifetime / explosion.maxLifetime;
      ctx.fillStyle = `rgba(255, 153, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, explosion.size * (1 - alpha * 0.5), 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw enemies
    this.activeEnemies.forEach(enemy => {
      if (!enemy.alive) return;
      
      // Draw enemy body
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.moveTo(enemy.x, enemy.y);
      ctx.lineTo(enemy.x - enemy.width/2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x + enemy.width/2, enemy.y + enemy.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw health bar for enemies with health > 1
      if (enemy.maxHealth > 1) {
        const healthPercent = enemy.health / enemy.maxHealth;
        const barWidth = enemy.width;
        const barHeight = 4;
        const barX = enemy.x - barWidth/2;
        const barY = enemy.y - 10;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        ctx.fillStyle = enemy.health > enemy.maxHealth * 0.5 ? '#0f0' : '#f00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
      }
    });
  }
  
  checkCollision(laser) {
    for (let i = 0; i < this.activeEnemies.length; i++) {
      const enemy = this.activeEnemies[i];
      
      if (!enemy.alive) continue;
      
      // Simple AABB collision
      if (
        laser.x > enemy.x - enemy.width/2 &&
        laser.x < enemy.x + enemy.width/2 &&
        laser.y > enemy.y &&
        laser.y < enemy.y + enemy.height
      ) {
        enemy.health--;
        
        if (enemy.health <= 0) {
          enemy.alive = false;
          this.game.score += enemy.score;
          
          // Create explosion effect
          this.createExplosion(enemy.x, enemy.y, enemy.width);
          
          return true;
        }
        
        // Hit but not destroyed
        return true;
      }
    }
    
    return false;
  }
  
  createExplosion(x, y, size) {
    // Add explosion to explosions list
    this.explosions.push({
      x: x,
      y: y,
      size: size * 1.5,
      maxLifetime: 30, // frames
      lifetime: 30
    });
  }
  
  getActiveEnemies() {
    return this.activeEnemies;
  }
  
  isWaveComplete() {
    return this.waveComplete;
  }
  
  nextWave() {
    this.startWave(this.currentWave + 1);
  }
  
  reset() {
    this.currentWave = 0;
    this.activeEnemies = [];
    this.explosions = [];
    this.waveComplete = false;
    this.waveTimer = 0;
    this.spawnTimer = 0;
    
    // Reset wave spawned flags
    this.waves.forEach(wave => {
      wave.enemies.forEach(enemyGroup => {
        enemyGroup.spawned = false;
      });
    });
  }
}