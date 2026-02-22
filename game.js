// MarterBlaster - Retro Space Shooter with Mobile Support
import TouchControls from './touch-controls.js';
import { EnemyWaveManager } from './enemy-wave-manager.js';

class MarterBlaster {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Game state
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 60; // 60 FPS target
    
    // Performance optimization flags
    this.isMobile = this.detectMobile();
    this.useHighDPI = this.isMobile && window.devicePixelRatio > 1;
    this.performanceMode = this.isMobile;
    
    // Initialize canvas with responsive sizing
    this.initCanvas();
    
    // Player
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 50,
      width: 50,
      height: 30,
      speed: 5,
      color: '#00f7ff',
      lasers: [],
      lastShot: 0,
      shotCooldown: 250 // ms between shots
    };
    
    // Enemy Wave Manager
    this.enemyWaveManager = new EnemyWaveManager(this);
    
    // Initialize first wave
    this.enemyWaveManager.startWave(0);
    
    // Touch controls
    this.touchControls = new TouchControls(this);
    
    // Initialize game
    this.init();
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  initCanvas() {
    // Set initial canvas size
    this.resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 100);
    });
    
    // Set up high DPI rendering for mobile
    if (this.useHighDPI) {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.style.width = this.canvas.width + 'px';
      this.canvas.style.height = this.canvas.height + 'px';
      this.canvas.width = this.canvas.width * dpr;
      this.canvas.height = this.canvas.height * dpr;
      this.ctx.scale(dpr, dpr);
    }
  }
  
  resizeCanvas() {
    const container = document.querySelector('.crt');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Maintain aspect ratio (800x600)
    const aspectRatio = 800 / 600;
    let newWidth = containerWidth;
    let newHeight = containerWidth / aspectRatio;
    
    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = containerHeight * aspectRatio;
    }
    
    // Set canvas dimensions
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    
    // Update player position if game is running
    if (this.player) {
      this.player.x = Math.min(this.player.x, this.canvas.width - this.player.width/2);
      this.player.y = this.canvas.height - 50;
    }
    
    // Note: Enemy wave manager handles its own positioning
  }
  
  handleResize() {
    this.resizeCanvas();
    
    // Reinitialize touch controls
    if (this.touchControls) {
      this.touchControls.positionControls();
    }
  }
  
  init() {
    // Set up keyboard controls (backward compatibility)
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Start game loop with performance optimization
    if (this.performanceMode) {
      this.gameLoopThrottled();
    } else {
      this.gameLoop();
    }
  }
  
  handleKeyDown(e) {
    if (this.gameOver) return;
    
    if (e.key === 'ArrowLeft') {
      this.player.x = Math.max(this.player.x - this.player.speed, this.player.width/2);
    }
    if (e.key === 'ArrowRight') {
      this.player.x = Math.min(this.player.x + this.player.speed, this.canvas.width - this.player.width/2);
    }
    if (e.key === ' ' || e.key === 'ArrowUp') {
      this.fireLaser();
    }
  }
  
  fireLaser() {
    const now = Date.now();
    if (now - this.player.lastShot < this.player.shotCooldown) return;
    
    this.player.lasers.push({
      x: this.player.x,
      y: this.player.y - 10
    });
    
    this.player.lastShot = now;
    
    // Play sound if available
    if (typeof this.playLaserSound === 'function') {
      this.playLaserSound();
    }
  }
  
  drawPlayer() {
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(
      this.player.x - this.player.width/2,
      this.player.y,
      this.player.width,
      this.player.height
    );
    
    // Draw ship details
    this.ctx.fillStyle = '#ff00ea';
    this.ctx.fillRect(this.player.x - 10, this.player.y - 10, 20, 10);
  }
  
  drawEnemies() {
    this.enemyWaveManager.draw(this.ctx);
  }
  
  drawLasers() {
    for (let i = this.player.lasers.length - 1; i >= 0; i--) {
      const laser = this.player.lasers[i];
      laser.y -= 10;
      
      if (laser.y < 0) {
        this.player.lasers.splice(i, 1);
        continue;
      }
      
      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(laser.x - 1.5, laser.y, 3, 15);
      
      // Check collisions using enemy wave manager
      if (this.enemyWaveManager.checkCollision(laser)) {
        this.player.lasers.splice(i, 1);
        document.getElementById('score').textContent = this.score;
        break;
      }
    }
  }
  
  drawStars() {
    this.ctx.fillStyle = '#ffffff';
    const starCount = this.performanceMode ? 50 : 100;
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.ctx.fillRect(x, y, 1, 1);
    }
  }
  
  drawHUD() {
    this.ctx.fillStyle = '#ff00ea';
    this.ctx.font = this.isMobile ? '12px "Press Start 2P"' : '16px "Press Start 2P"';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SCORE: ${this.score}`, 10, 20);
    this.ctx.fillText(`LIVES: ${this.lives}`, this.canvas.width - 120, 20);
    
    // Draw wave indicator
    this.ctx.fillText(`WAVE: ${this.enemyWaveManager.currentWave + 1}`, this.canvas.width / 2 - 60, 20);
  }
  
  gameLoop(timestamp) {
    if (this.gameOver) {
      this.drawGameOver();
      return;
    }
    
    // Calculate delta time for consistent movement
    const deltaTime = timestamp ? (timestamp - this.lastFrameTime) / 16.67 : 1;
    this.lastFrameTime = timestamp || 0;
    
    // Clear canvas with performance optimization
    if (this.performanceMode) {
      this.ctx.fillStyle = 'rgba(10, 10, 18, 0.3)';
    } else {
      this.ctx.fillStyle = 'rgba(10, 10, 18, 0.2)';
    }
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw elements
    this.drawStars();
    this.drawEnemies();
    this.drawPlayer();
    this.drawLasers();
    this.drawHUD();
    
    // Draw touch controls on mobile
    if (this.isMobile && this.touchControls) {
      this.touchControls.draw(this.ctx);
    }
    
    // Update enemy wave manager
    this.enemyWaveManager.update(deltaTime);
    
    // Check if current wave is complete and start next wave
    if (this.enemyWaveManager.isWaveComplete()) {
      this.enemyWaveManager.nextWave();
    }
    
    requestAnimationFrame((ts) => this.gameLoop(ts));
  }
  
  gameLoopThrottled() {
    // Throttled game loop for mobile performance
    const loop = (timestamp) => {
      if (!this.lastFrameTime) this.lastFrameTime = timestamp;
      
      const elapsed = timestamp - this.lastFrameTime;
      
      if (elapsed > this.frameInterval) {
        this.gameLoop(timestamp);
      }
      
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }
  
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#ff00ea';
    this.ctx.font = this.isMobile ? '24px "Press Start 2P"' : '48px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
    
    this.ctx.font = this.isMobile ? '12px "Press Start 2P"' : '24px "Press Start 2P"';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new MarterBlaster();
  
  // Make game instance globally available for debugging
  window.game = game;
});