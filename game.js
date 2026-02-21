// MarterBlaster - Retro Space Shooter
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game state
let score = 0;
let lives = 3;
let gameOver = false;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 30,
  speed: 5,
  color: '#00f7ff',
  lasers: []
};

// Enemies
const enemies = [];
const enemyRows = 5;
const enemyCols = 10;

// Initialize enemies
for (let row = 0; row < enemyRows; row++) {
  for (let col = 0; col < enemyCols; col++) {
    enemies.push({
      x: 100 + col * 60,
      y: 50 + row * 50,
      width: 40,
      height: 30,
      speed: 1,
      color: '#ff00ea',
      alive: true
    });
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.width/2, player.y, player.width, player.height);
  
  // Draw ship details
  ctx.fillStyle = '#ff00ea';
  ctx.fillRect(player.x - 10, player.y - 10, 20, 10);
}

// Draw enemies
function drawEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y);
    ctx.lineTo(enemy.x - enemy.width/2, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width/2, enemy.y + enemy.height);
    ctx.closePath();
    ctx.fill();
  });
}

// Draw lasers
function drawLasers() {
  player.lasers.forEach((laser, index) => {
    laser.y -= 10;
    
    if (laser.y < 0) {
      player.lasers.splice(index, 1);
      return;
    }
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(laser.x, laser.y, 3, 15);
    
    // Check collisions
    enemies.forEach(enemy => {
      if (!enemy.alive) return;
      
      if (
        laser.x > enemy.x - enemy.width/2 &&
        laser.x < enemy.x + enemy.width/2 &&
        laser.y > enemy.y &&
        laser.y < enemy.y + enemy.height
      ) {
        enemy.alive = false;
        player.lasers.splice(index, 1);
        score += 100;
        document.getElementById('score').textContent = score;
        
        // Add explosion effect
        setTimeout(() => {
          ctx.fillStyle = '#ff9900';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2);
          ctx.fill();
        }, 0);
      }
    });
  });
}

// Draw background stars
function drawStars() {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1, 1);
  }
}

// Game loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff00ea';
    ctx.font = '48px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    
    ctx.font = '24px "Press Start 2P"';
    ctx.fillText(`FINAL SCORE: ${score}`, canvas.width/2, canvas.height/2 + 50);
    return;
  }
  
  // Clear canvas
  ctx.fillStyle = 'rgba(10, 10, 18, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw elements
  drawStars();
  drawEnemies();
  drawPlayer();
  drawLasers();
  
  // Move enemies
  enemies.forEach(enemy => {
    if (enemy.alive) {
      enemy.x += enemy.speed;
      
      // Reverse direction at edges
      if (enemy.x > canvas.width - 20 || enemy.x < 20) {
        enemies.forEach(e => {
          if (e.alive) e.speed *= -1;
        });
      }
    }
  });
  
  // Check if all enemies are defeated
  if (enemies.every(enemy => !enemy.alive)) {
    resetEnemies();
  }
  
  requestAnimationFrame(gameLoop);
}

// Reset enemies with increased difficulty
function resetEnemies() {
  enemies.forEach(enemy => {
    enemy.alive = true;
    enemy.speed *= 1.2; // Increase speed
    enemy.y += 20; // Move closer to player
  });
}

// Player controls
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.x = Math.max(player.x - player.speed, player.width/2);
  if (e.key === 'ArrowRight') player.x = Math.min(player.x + player.speed, canvas.width - player.width/2);
  if (e.key === ' ' || e.key === 'ArrowUp') {
    player.lasers.push({
      x: player.x,
      y: player.y - 10
    });
  }
});

// Initialize game
gameLoop();