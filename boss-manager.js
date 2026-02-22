// Boss Manager - Handles boss spawning, lifecycle, and combat
import { Boss } from './bosses.js';

export class BossManager {
  constructor(game) {
    this.game = game;
    this.currentBoss = null;
    this.bosses = [];
    this.bossQueue = [];
    this.isBossActive = false;
    this.bossSpawnTimer = 0;
    this.bossDefeatCallback = null;
    
    // Boss phase transition effects
    this.transitionEffects = {
      active: false,
      timer: 0,
      duration: 60, // 1 second at 60fps
      type: 'phase',
      particles: []
    };
  }
  
  /**
   * Initialize boss manager
   */
  init() {
    this.bosses = [];
    this.currentBoss = null;
    this.isBossActive = false;
  }
  
  /**
   * Queue a boss for spawning
   * @param {string} bossId - Boss identifier
   * @param {number} delay - Delay before spawning (frames)
   */
  queueBoss(bossId, delay = 180) { // 3 seconds at 60fps
    this.bossQueue.push({
      id: bossId,
      delay,
      timer: 0
    });
  }
  
  /**
   * Spawn a boss immediately
   * @param {string} bossId - Boss identifier
   */
  spawnBoss(bossId) {
    const boss = new Boss(bossId, this.game);
    
    // Position boss at top center of screen
    boss.x = this.game.canvas.width / 2;
    boss.y = 100;
    
    this.currentBoss = boss;
    this.bosses.push(boss);
    this.isBossActive = true;
    
    // Trigger boss entrance animation
    this.triggerEntranceEffect(boss);
    
    console.log(`Boss spawned: ${boss.name}`);
    return boss;
  }
  
  /**
   * Update all bosses and manager state
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Update boss queue
    this.updateBossQueue(deltaTime);
    
    // Update current boss
    if (this.currentBoss && this.currentBoss.active) {
      this.currentBoss.update(deltaTime);
      
      // Check for boss defeat
      if (this.currentBoss.health <= 0) {
        this.defeatBoss();
      }
      
      // Check for phase transitions
      this.checkPhaseTransitions();
    }
    
    // Update transition effects
    this.updateTransitionEffects(deltaTime);
    
    // Update boss projectiles
    this.updateBossProjectiles(deltaTime);
  }
  
  /**
   * Update boss queue timing
   * @param {number} deltaTime - Time since last update
   */
  updateBossQueue(deltaTime) {
    if (this.bossQueue.length > 0 && !this.isBossActive) {
      const nextBoss = this.bossQueue[0];
      nextBoss.timer += deltaTime;
      
      if (nextBoss.timer >= nextBoss.delay) {
        this.spawnBoss(nextBoss.id);
        this.bossQueue.shift();
      }
    }
  }
  
  /**
   * Update boss projectiles
   * @param {number} deltaTime - Time since last update
   */
  updateBossProjectiles(deltaTime) {
    if (!this.currentBoss) return;
    
    // Update existing projectiles
    for (let i = this.currentBoss.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.currentBoss.projectiles[i];
      
      // Update position
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      
      // Update laser duration
      if (projectile.type === 'laser') {
        if (projectile.warning && projectile.warningTime > 0) {
          projectile.warningTime--;
          if (projectile.warningTime <= 0) {
            projectile.warning = false;
          }
        } else if (projectile.framesRemaining > 0) {
          projectile.framesRemaining--;
          if (projectile.framesRemaining <= 0) {
            this.currentBoss.projectiles.splice(i, 1);
            continue;
          }
        }
      }
      
      // Update homing missiles
      if (projectile.homing && this.game.player) {
        const player = this.game.player;
        const dx = player.x - projectile.x;
        const dy = player.y - projectile.y;
        const targetAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(projectile.vy, projectile.vx);
        
        // Gradually turn toward player
        let angleDiff = targetAngle - currentAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        const turnAmount = Math.min(Math.abs(angleDiff), projectile.turnRate) * Math.sign(angleDiff);
        const newAngle = currentAngle + turnAmount;
        
        const speed = Math.sqrt(projectile.vx * projectile.vx + projectile.vy * projectile.vy);
        projectile.vx = Math.cos(newAngle) * speed;
        projectile.vy = Math.sin(newAngle) * speed;
      }
      
      // Remove projectiles that are off-screen
      if (projectile.x < -50 || projectile.x > this.game.canvas.width + 50 ||
          projectile.y < -50 || projectile.y > this.game.canvas.height + 50) {
        this.currentBoss.projectiles.splice(i, 1);
      }
    }
  }
  
  /**
   * Check for boss phase transitions
   */
  checkPhaseTransitions() {
    if (!this.currentBoss) return;
    
    const boss = this.currentBoss;
    const healthPercent = boss.health / boss.maxHealth;
    
    // Check if boss should transition to next phase
    for (let i = 0; i < boss.phases.length; i++) {
      const phase = boss.phases[i];
      if (!phase.activated && healthPercent <= phase.healthThreshold) {
        this.transitionToPhase(i);
        break;
      }
    }
  }
  
  /**
   * Transition boss to a new phase
   * @param {number} phaseIndex - Phase index to transition to
   */
  transitionToPhase(phaseIndex) {
    if (!this.currentBoss || phaseIndex >= this.currentBoss.phases.length) return;
    
    const boss = this.currentBoss;
    const phase = boss.phases[phaseIndex];
    
    // Mark phase as activated
    phase.activated = true;
    boss.currentPhase = phaseIndex;
    
    // Update boss behavior based on phase
    boss.attackPattern = phase.attackPattern;
    boss.attackCooldown = phase.attackCooldown;
    boss.movementPattern = phase.movementPattern;
    
    // Trigger phase transition effect
    this.triggerPhaseTransitionEffect(phaseIndex);
    
    console.log(`Boss ${boss.name} transitioned to phase ${phaseIndex + 1}`);
  }
  
  /**
   * Trigger boss entrance effect
   * @param {Boss} boss - The boss entering
   */
  triggerEntranceEffect(boss) {
    this.transitionEffects = {
      active: true,
      timer: 0,
      duration: 90, // 1.5 seconds
      type: 'entrance',
      boss: boss,
      particles: this.generateEntranceParticles(boss)
    };
    
    // Play boss entrance sound
    if (this.game.audio) {
      this.game.audio.play('boss_entrance');
    }
  }
  
  /**
   * Trigger phase transition effect
   * @param {number} phaseIndex - New phase index
   */
  triggerPhaseTransitionEffect(phaseIndex) {
    this.transitionEffects = {
      active: true,
      timer: 0,
      duration: 60, // 1 second
      type: 'phase',
      phaseIndex: phaseIndex,
      particles: this.generateTransitionParticles()
    };
    
    // Play phase transition sound
    if (this.game.audio) {
      this.game.audio.play('phase_transition');
    }
    
    // Clear existing projectiles during transition
    if (this.currentBoss) {
      this.currentBoss.projectiles = [];
    }
  }
  
  /**
   * Generate particles for boss entrance
   * @param {Boss} boss - The boss entering
   * @returns {Array} Array of particle objects
   */
  generateEntranceParticles(boss) {
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: boss.x,
        y: boss.y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 1,
        color: boss.color,
        life: Math.random() * 60 + 30
      });
    }
    
    return particles;
  }
  
  /**
   * Generate particles for phase transition
   * @returns {Array} Array of particle objects
   */
  generateTransitionParticles() {
    const particles = [];
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * this.game.canvas.width,
        y: Math.random() * this.game.canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        life: Math.random() * 90 + 30
      });
    }
    
    return particles;
  }
  
  /**
   * Update transition effects
   * @param {number} deltaTime - Time since last update
   */
  updateTransitionEffects(deltaTime) {
    if (!this.transitionEffects.active) return;
    
    this.transitionEffects.timer += deltaTime;
    
    // Update particles
    for (let i = this.transitionEffects.particles.length - 1; i >= 0; i--) {
      const particle = this.transitionEffects.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      
      if (particle.life <= 0) {
        this.transitionEffects.particles.splice(i, 1);
      }
    }
    
    // End transition effect
    if (this.transitionEffects.timer >= this.transitionEffects.duration) {
      this.transitionEffects.active = false;
      
      // Boss becomes vulnerable after entrance
      if (this.transitionEffects.type === 'entrance' && this.currentBoss) {
        this.currentBoss.vulnerable = true;
      }
    }
  }
  
  /**
   * Handle boss defeat
   */
  defeatBoss() {
    if (!this.currentBoss) return;
    
    const boss = this.currentBoss;
    boss.active = false;
    
    // Trigger defeat explosion
    this.triggerDefeatExplosion(boss);
    
    // Award score
    if (this.game) {
      this.game.score += boss.scoreValue;
    }
    
    // Call defeat callback
    if (this.bossDefeatCallback) {
      this.bossDefeatCallback(boss);
    }
    
    // Clear boss after delay
    setTimeout(() => {
      const index = this.bosses.indexOf(boss);
      if (index > -1) {
        this.bosses.splice(index, 1);
      }
      this.currentBoss = null;
      this.isBossActive = false;
    }, 2000); // 2 second delay for explosion animation
    
    console.log(`Boss defeated: ${boss.name}`);
  }
  
  /**
   * Trigger defeat explosion effect
   * @param {Boss} boss - The defeated boss
   */
  triggerDefeatExplosion(boss) {
    // Generate explosion particles
    const explosionParticles = [];
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
      explosionParticles.push({
        x: boss.x + (Math.random() - 0.5) * boss.width,
        y: boss.y + (Math.random() - 0.5) * boss.height,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        size: Math.random() * 8 + 2,
        color: boss.color,
        life: Math.random() * 120 + 60
      });
    }
    
    // Add to transition effects for rendering
    this.transitionEffects = {
      active: true,
      timer: 0,
      duration: 120, // 2 seconds
      type: 'defeat',
      particles: explosionParticles
    };
    
    // Play defeat sound
    if (this.game.audio) {
      this.game.audio.play('boss_defeat');
    }
  }
  
  /**
   * Render all bosses and effects
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    // Render transition effects
    this.renderTransitionEffects(ctx);
    
    // Render current boss
    if (this.currentBoss && this.currentBoss.active) {
      this.currentBoss.render(ctx);
      
      // Render boss projectiles
      this.renderBossProjectiles(ctx);
      
      // Render boss health bar
      this.renderBossHealthBar(ctx);
    }
  }
  
  /**
   * Render transition effects
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderTransitionEffects(ctx) {
    if (!this.transitionEffects.active) return;
    
    const effect = this.transitionEffects;
    
    // Render particles
    effect.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life / 100;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    // Render transition text
    if (effect.type === 'entrance' && effect.boss) {
      ctx.save();
      ctx.fillStyle = '#ff00ea';
      ctx.font = '32px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1 - (effect.timer / effect.duration);
      ctx.fillText(effect.boss.name.toUpperCase(), this.game.canvas.width / 2, 200);
      ctx.restore();
    } else if (effect.type === 'phase') {
      ctx.save();
      ctx.fillStyle = '#00f7ff';
      ctx.font = '24px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1 - (effect.timer / effect.duration);
      ctx.fillText(`PHASE ${effect.phaseIndex + 1}`, this.game.canvas.width / 2, 200);
      ctx.restore();
    }
  }
  
  /**
   * Render boss projectiles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderBossProjectiles(ctx) {
    if (!this.currentBoss) return;
    
    this.currentBoss.projectiles.forEach(projectile => {
      if (projectile.type === 'laser') {
        // Render laser beam
        if (projectile.warning) {
          // Warning phase - dashed line
          ctx.save();
          ctx.strokeStyle = '#ff9900';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(projectile.x, projectile.y);
          ctx.lineTo(
            projectile.x + Math.cos(projectile.angle) * projectile.length,
            projectile.y + Math.sin(projectile.angle) * projectile.length
          );
          ctx.stroke();
          ctx.restore();
        } else {
          // Active laser
          ctx.save();
          const gradient = ctx.createLinearGradient(
            projectile.x, projectile.y,
            projectile.x + Math.cos(projectile.angle) * projectile.length,
            projectile.y + Math.sin(projectile.angle) * projectile.length
          );
          gradient.addColorStop(0, '#ff0000');
          gradient.addColorStop(0.5, '#ffff00');
          gradient.addColorStop(1, '#ff0000');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = projectile.width;
          ctx.beginPath();
          ctx.moveTo(projectile.x, projectile.y);
          ctx.lineTo(
            projectile.x + Math.cos(projectile.angle) * projectile.length,
            projectile.y + Math.sin(projectile.angle) * projectile.length
          );
          ctx.stroke();
          ctx.restore();
        }
      } else {
        // Render normal bullets
        ctx.save();
        ctx.fillStyle = projectile.type === 'homing' ? '#ff00ea' : '#ff9900';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add trail for homing missiles
        if (projectile.type === 'homing') {
          ctx.strokeStyle = '#ff00ea';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(projectile.x, projectile.y);
          ctx.lineTo(projectile.x - projectile.vx * 3, projectile.y - projectile.vy * 3);
          ctx.stroke();
        }
        ctx.restore();
      }
    });
  }
  
  /**
   * Render boss health bar
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderBossHealthBar(ctx) {
    if (!this.currentBoss) return;
    
    const boss = this.currentBoss;
    const canvas = this.game.canvas;
    
    // Health bar dimensions
    const barWidth = 400;
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = 30;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
    
    // Health fill
    const healthPercent = boss.health / boss.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : 
                    healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Boss name
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(boss.name, canvas.width / 2, barY - 10);
    
    // Phase indicators
    const phaseWidth = barWidth / boss.phases.length;
    for (let i = 1; i < boss.phases.length; i++) {
      const phaseX = barX + (phaseWidth * i);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(phaseX, barY);
      ctx.lineTo(phaseX, barY + barHeight);
      ctx.stroke();
    }
  }
  
  /**
   * Check collision between player projectiles and boss
   * @param {Array} playerProjectiles - Player's projectiles
   * @returns {number} Total damage dealt
   */
  checkPlayerCollisions(playerProjectiles) {
    if (!this.currentBoss || !this.currentBoss.vulnerable) return 0;
    
    let totalDamage = 0;
    const boss = this.currentBoss;
    
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
      const projectile = playerProjectiles[i];
      
      // Simple circle collision for now
      const dx = projectile.x - boss.x;
      const dy = projectile.y - boss.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < boss.hitRadius) {
        // Apply damage
        const damage = projectile.damage || 1;
        boss.health -= damage;
        totalDamage += damage;
        
        // Remove projectile
        playerProjectiles.splice(i, 1);
        
        // Trigger hit effect
        this.triggerHitEffect(projectile.x, projectile.y);
        
        // Check weak points
        this.checkWeakPointHit(boss, projectile.x, projectile.y);
      }
    }
    
    return totalDamage;
  }
  
  /**
   * Check collision between boss projectiles and player
   * @param {Object} player - Player object
   * @returns {boolean} True if player was hit
   */
  checkBossProjectileCollisions(player) {
    if (!this.currentBoss || !player) return false;
    
    let playerHit = false;
    const boss = this.currentBoss;
    
    for (let i = boss.projectiles.length - 1; i >= 0; i--) {
      const projectile = boss.projectiles[i];
      
      // Check collision with player
      const dx = projectile.x - player.x;
      const dy = projectile.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const playerRadius = Math.max(player.width, player.height) / 2;
      
      if (distance < playerRadius + 4) { // 4 is bullet radius
        // Player hit
        playerHit = true;
        
        // Remove projectile
        boss.projectiles.splice(i, 1);
        
        // Trigger hit effect
        this.triggerHitEffect(projectile.x, projectile.y, true);
      }
    }
    
    return playerHit;
  }
  
  /**
   * Check if a hit landed on a weak point
   * @param {Boss} boss - The boss
   * @param {number} hitX - Hit x coordinate
   * @param {number} hitY - Hit y coordinate
   */
  checkWeakPointHit(boss, hitX, hitY) {
    if (!boss.weakPoints) return;
    
    for (const weakPoint of boss.weakPoints) {
      if (weakPoint.destroyed) continue;
      
      const dx = hitX - weakPoint.x;
      const dy = hitY - weakPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < weakPoint.radius) {
        // Weak point hit!
        weakPoint.health--;
        
        if (weakPoint.health <= 0) {
          weakPoint.destroyed = true;
          // Bonus damage or effect
          boss.health -= weakPoint.bonusDamage || 50;
          this.triggerWeakPointDestroyedEffect(weakPoint);
        } else {
          this.triggerWeakPointHitEffect(weakPoint);
        }
        break;
      }
    }
  }
  
  /**
   * Trigger hit effect
   * @param {number} x - Hit x coordinate
   * @param {number} y - Hit y coordinate
   * @param {boolean} playerHit - Whether player was hit
   */
  triggerHitEffect(x, y, playerHit = false) {
    // Generate spark particles
    const particles = [];
    const count = playerHit ? 10 : 5;
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 3 + 1,
        color: playerHit ? '#ff0000' : '#ffff00',
        life: Math.random() * 30 + 15
      });
    }
    
    // Add to transition effects
    if (!this.transitionEffects.active) {
      this.transitionEffects = {
        active: true,
        timer: 0,
        duration: 30,
        type: 'hit',
        particles: particles
      };
    } else {
      // Add to existing particles
      this.transitionEffects.particles.push(...particles);
    }
    
    // Play hit sound
    if (this.game.audio) {
      this.game.audio.play(playerHit ? 'player_hit' : 'enemy_hit');
    }
  }
  
  /**
   * Trigger weak point hit effect
   * @param {Object} weakPoint - The weak point hit
   */
  triggerWeakPointHitEffect(weakPoint) {
    // Generate special particles for weak point hit
    const particles = [];
    
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: weakPoint.x,
        y: weakPoint.y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 4 + 2,
        color: '#ff00ff',
        life: Math.random() * 45 + 30
      });
    }
    
    // Add to transition effects
    if (!this.transitionEffects.active) {
      this.transitionEffects = {
        active: true,
        timer: 0,
        duration: 45,
        type: 'weakpoint_hit',
        particles: particles
      };
    } else {
      this.transitionEffects.particles.push(...particles);
    }
    
    // Play weak point hit sound
    if (this.game.audio) {
      this.game.audio.play('weakpoint_hit');
    }
  }
  
  /**
   * Trigger weak point destroyed effect
   * @param {Object} weakPoint - The destroyed weak point
   */
  triggerWeakPointDestroyedEffect(weakPoint) {
    // Generate explosion particles
    const particles = [];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: weakPoint.x,
        y: weakPoint.y,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        size: Math.random() * 6 + 3,
        color: '#00ffff',
        life: Math.random() * 60 + 45
      });
    }
    
    // Add to transition effects
    if (!this.transitionEffects.active) {
      this.transitionEffects = {
        active: true,
        timer: 0,
        duration: 60,
        type: 'weakpoint_destroyed',
        particles: particles
      };
    } else {
      this.transitionEffects.particles.push(...particles);
    }
    
    // Play weak point destroyed sound
    if (this.game.audio) {
      this.game.audio.play('weakpoint_destroyed');
    }
  }
  
  /**
   * Reset boss manager
   */
  reset() {
    this.currentBoss = null;
    this.bosses = [];
    this.bossQueue = [];
    this.isBossActive = false;
    this.transitionEffects.active = false;
  }
}