// Boss Class and Definitions
// 8 Stage Bosses for MerterBlaster

import * as Patterns from './boss-patterns.js';

export class Boss {
  constructor(bossId, game) {
    this.game = game;
    this.id = bossId;
    this.active = true;
    this.vulnerable = false; // Becomes true after entrance animation
    
    // Load boss definition
    const definition = BOSS_DEFINITIONS[bossId] || BOSS_DEFINITIONS['boss1'];
    Object.assign(this, definition);
    
    // Initialize state
    this.health = this.maxHealth;
    this.currentPhase = 0;
    this.attackTimer = 0;
    this.movementTimer = 0;
    this.projectiles = [];
    this.weakPoints = this.weakPoints ? [...this.weakPoints] : [];
    
    // Initialize phases
    this.phases.forEach(phase => {
      phase.activated = false;
    });
    
    // Activate first phase
    if (this.phases.length > 0) {
      this.phases[0].activated = true;
    }
  }
  
  /**
   * Update boss state
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    if (!this.active || !this.vulnerable) return;
    
    // Update movement
    this.updateMovement(deltaTime);
    
    // Update attacks
    this.updateAttacks(deltaTime);
    
    // Update weak points
    this.updateWeakPoints(deltaTime);
  }
  
  /**
   * Update boss movement based on current pattern
   * @param {number} deltaTime - Time since last update
   */
  updateMovement(deltaTime) {
    this.movementTimer += deltaTime;
    
    const phase = this.phases[this.currentPhase];
    if (!phase || !phase.movementPattern) return;
    
    switch (phase.movementPattern) {
      case 'horizontal_sweep':
        // Sweep horizontally across screen
        this.x = this.initialX + Math.sin(this.movementTimer * 0.02) * 200;
        break;
        
      case 'vertical_bob':
        // Bob up and down
        this.y = this.initialY + Math.sin(this.movementTimer * 0.03) * 50;
        break;
        
      case 'figure_eight':
        // Move in figure-eight pattern
        this.x = this.initialX + Math.sin(this.movementTimer * 0.015) * 150;
        this.y = this.initialY + Math.sin(this.movementTimer * 0.03) * 75;
        break;
        
      case 'stationary':
        // Stay in place
        break;
        
      case 'charge':
        // Charge toward player periodically
        if (this.movementTimer % 180 < 60) { // Charge every 3 seconds for 1 second
          const player = this.game.player;
          if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
              this.x += (dx / distance) * 3;
              this.y += (dy / distance) * 3;
            }
          }
        }
        break;
    }
    
    // Update weak point positions
    this.updateWeakPointPositions();
  }
  
  /**
   * Update boss attacks
   * @param {number} deltaTime - Time since last update
   */
  updateAttacks(deltaTime) {
    this.attackTimer += deltaTime;
    
    const phase = this.phases[this.currentPhase];
    if (!phase || !phase.attackPattern) return;
    
    // Check if it's time to attack
    if (this.attackTimer >= phase.attackCooldown) {
      this.attackTimer = 0;
      this.executeAttackPattern(phase.attackPattern);
    }
  }
  
  /**
   * Execute an attack pattern
   * @param {string} pattern - Attack pattern identifier
   */
  executeAttackPattern(pattern) {
    const player = this.game.player;
    
    switch (pattern) {
      case 'spiral':
        this.projectiles.push(...Patterns.generateSpiralPattern(
          this.x, this.y + 20, 24, 3, this.attackTimer * 0.1, 0.15
        ));
        break;
        
      case 'ring':
        this.projectiles.push(...Patterns.generateRingPattern(
          this.x, this.y + 20, 2, 16, 4, 0.1
        ));
        break;
        
      case 'shotgun':
        if (player) {
          this.projectiles.push(...Patterns.generateShotgunPattern(
            this.x, this.y + 20, player.x, player.y, 0.6, 9, 6
          ));
        }
        break;
        
      case 'laser':
        if (player) {
          const angle = Math.atan2(player.y - this.y, player.x - this.x);
          this.projectiles.push(Patterns.generateLaserBeam(
            this.x, this.y + 20, 25, 500, angle, 90
          ));
        }
        break;
        
      case 'curtain_vertical':
        this.projectiles.push(...Patterns.generateCurtainPattern(
          100, 50, 700, 50, 15, 4, false
        ));
        break;
        
      case 'curtain_horizontal':
        this.projectiles.push(...Patterns.generateCurtainPattern(
          50, 100, 50, 400, 12, 4, true
        ));
        break;
        
      case 'homing':
        this.projectiles.push(...Patterns.generateHomingMissiles(
          this.x, this.y + 20, 4, 2, 0.04
        ));
        break;
        
      case 'wave':
        this.projectiles.push(...Patterns.generateWavePattern(
          this.x, this.y + 20, 20, 3, 1.5, 0.2
        ));
        break;
        
      case 'random_spread':
        this.projectiles.push(...Patterns.generateRandomSpread(
          this.x, this.y + 20, 16, 2, 5
        ));
        break;
        
      case 'targeted_burst':
        if (player) {
          const bursts = Patterns.generateTargetedBurst(
            this.x, this.y + 20, player.x, player.y, 3, 5, 20, 5
          );
          // Execute bursts with delay
          bursts.forEach((burst, index) => {
            setTimeout(() => {
              this.projectiles.push(...burst.bullets);
            }, burst.delay * 16.67); // Convert frames to ms (60fps)
          });
        }
        break;
        
      case 'mixed_pattern':
        // Combine multiple patterns
        this.projectiles.push(...Patterns.generateSpiralPattern(
          this.x, this.y + 20, 18, 3, this.attackTimer * 0.1, 0.1
        ));
        
        if (player) {
          this.projectiles.push(...Patterns.generateShotgunPattern(
            this.x, this.y + 20, player.x, player.y, 0.4, 5, 5
          ));
        }
        break;
    }
    
    // Play attack sound
    if (this.game.audio) {
      this.game.audio.play('boss_attack');
    }
  }
  
  /**
   * Update weak point positions and states
   * @param {number} deltaTime - Time since last update
   */
  updateWeakPoints(deltaTime) {
    // Update weak point animations
    this.weakPoints.forEach(weakPoint => {
      if (!weakPoint.destroyed) {
        weakPoint.pulseTimer = (weakPoint.pulseTimer || 0) + deltaTime;
      }
    });
  }
  
  /**
   * Update weak point positions relative to boss
   */
  updateWeakPointPositions() {
    this.weakPoints.forEach(weakPoint => {
      if (weakPoint.relative) {
        weakPoint.x = this.x + weakPoint.offsetX;
        weakPoint.y = this.y + weakPoint.offsetY;
      }
    });
  }
  
  /**
   * Render the boss
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    if (!this.active) return;
    
    ctx.save();
    
    // Draw boss body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw boss details
    ctx.fillStyle = this.detailColor || '#ff00ea';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw weak points
    this.renderWeakPoints(ctx);
    
    // Draw damage effects if health is low
    if (this.health < this.maxHealth * 0.3) {
      this.renderDamageEffects(ctx);
    }
    
    ctx.restore();
  }
  
  /**
   * Render weak points
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderWeakPoints(ctx) {
    this.weakPoints.forEach(weakPoint => {
      if (weakPoint.destroyed) return;
      
      ctx.save();
      
      // Pulsing effect
      const pulse = Math.sin(weakPoint.pulseTimer * 0.1) * 0.2 + 0.8;
      const radius = weakPoint.radius * pulse;
      
      // Draw weak point
      ctx.fillStyle = weakPoint.color;
      ctx.beginPath();
      ctx.arc(weakPoint.x, weakPoint.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        weakPoint.x - radius * 0.3,
        weakPoint.y - radius * 0.3,
        radius * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.restore();
    });
  }
  
  /**
   * Render damage effects
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderDamageEffects(ctx) {
    // Spark effects when heavily damaged
    const sparkCount = Math.floor((1 - this.health / this.maxHealth) * 10);
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = this.width / 2 + Math.random() * 10;
      const x = this.x + Math.cos(angle) * distance;
      const y = this.y + Math.sin(angle) * distance;
      
      ctx.save();
      ctx.fillStyle = '#ff9900';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

// Boss Definitions - 8 Stage Bosses
const BOSS_DEFINITIONS = {
  // Stage 1 Boss: The Sentinel
  boss1: {
    name: 'The Sentinel',
    maxHealth: 1000,
    width: 80,
    height: 60,
    hitRadius: 40,
    color: '#00aaff',
    detailColor: '#0055ff',
    scoreValue: 5000,
    initialX: 400,
    initialY: 100,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'spiral',
        attackCooldown: 90,
        movementPattern: 'horizontal_sweep'
      },
      {
        healthThreshold: 0.6,
        attackPattern: 'mixed_pattern',
        attackCooldown: 70,
        movementPattern: 'figure_eight'
      },
      {
        healthThreshold: 0.3,
        attackPattern: 'ring',
        attackCooldown: 50,
        movementPattern: 'charge'
      }
    ],
    weakPoints: [
      {
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: -20,
        relative: true,
        radius: 15,
        health: 3,
        color: '#ff5555',
        bonusDamage: 100
      }
    ]
  },
  
  // Stage 2 Boss: Vortex Core
  boss2: {
    name: 'Vortex Core',
    maxHealth: 1500,
    width: 100,
    height: 100,
    hitRadius: 50,
    color: '#aa00ff',
    detailColor: '#ff00ff',
    scoreValue: 7500,
    initialX: 400,
    initialY: 120,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'ring',
        attackCooldown: 120,
        movementPattern: 'stationary'
      },
      {
        healthThreshold: 0.7,
        attackPattern: 'spiral',
        attackCooldown: 80,
        movementPattern: 'vertical_bob'
      },
      {
        healthThreshold: 0.4,
        attackPattern: 'wave',
        attackCooldown: 60,
        movementPattern: 'figure_eight'
      }
    ],
    weakPoints: [
      {
        x: 0,
        y: 0,
        offsetX: -30,
        offsetY: 0,
        relative: true,
        radius: 12,
        health: 2,
        color: '#ffff55',
        bonusDamage: 75
      },
      {
        x: 0,
        y: 0,
        offsetX: 30,
        offsetY: 0,
        relative: true,
        radius: 12,
        health: 2,
        color: '#ffff55',
        bonusDamage: 75
      }
    ]
  },
  
  // Stage 3 Boss: Artillery Fortress
  boss3: {
    name: 'Artillery Fortress',
    maxHealth: 2000,
    width: 120,
    height: 80,
    hitRadius: 60,
    color: '#ffaa00',
    detailColor: '#ff5500',
    scoreValue: 10000,
    initialX: 400,
    initialY: 100,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'shotgun',
        attackCooldown: 100,
        movementPattern: 'horizontal_sweep'
      },
      {
        healthThreshold: 0.65,
        attackPattern: 'curtain_vertical',
        attackCooldown: 140,
        movementPattern: 'stationary'
      },
      {
        healthThreshold: 0.35,
        attackPattern: 'targeted_burst',
        attackCooldown: 80,
        movementPattern: 'charge'
      }
    ],
    weakPoints: [
      {
        x: 0,
        y: 0,
        offsetX: -40,
        offsetY: 20,
        relative: true,
        radius: 10,
        health: 3,
        color: '#55ffff',
        bonusDamage: 50
      },
      {
        x: 0,
        y: 0,
        offsetX: 40,
        offsetY: 20,
        relative: true,
        radius: 10,
        health: 3,
        color: '#55ffff',
        bonusDamage: 50
      },
      {
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: -30,
        relative: true,
        radius: 15,
        health: 4,
        color: '#ff55ff',
        bonusDamage: 100
      }
    ]
  },
  
  // Stage 4 Boss: Laser Nexus
  boss4: {
    name: 'Laser Nexus',
    maxHealth: 2500,
    width: 90,
    height: 90,
    hitRadius: 45,
    color: '#00ffaa',
    detailColor: '#00aa55',
    scoreValue: 12500,
    initialX: 400,
    initialY: 110,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'laser',
        attackCooldown: 180,
        movementPattern: 'figure_eight'
      },
      {
        healthThreshold: 0.6,
        attackPattern: 'mixed_pattern',
        attackCooldown: 100,
        movementPattern: 'vertical_bob'
      },
      {
        healthThreshold: 0.3,
        attackPattern: 'ring',
        attackCooldown: 70,
        movementPattern: 'charge'
      }
    ],
    weakPoints: [
      {
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        relative: true,
        radius: 20,
        health: 5,
        color: '#ff5555',
        bonusDamage: 150
      }
    ]
  },
  
  // Stage 5 Boss: Curtain Wall
  boss5: {
    name: 'Curtain Wall',
    maxHealth: 3000,
    width: 140,
    height: 60,
    hitRadius: 70,
    color: '#ff55aa',
    detailColor: '#aa0055',
    scoreValue: 15000,
    initialX: 400,
    initialY: 100,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'curtain_horizontal',
        attackCooldown: 150,
        movementPattern: 'horizontal_sweep'
      },
      {
        healthThreshold: 0.7,
        attackPattern: 'curtain_vertical',
        attackCooldown: 120,
        movementPattern: 'stationary'
      },
      {
        healthThreshold: 0.4,
        attackPattern: 'mixed_pattern',
        attack