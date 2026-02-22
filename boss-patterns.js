// Boss Pattern Generation Functions
// Classic 1990s shoot-em-up attack patterns

/**
 * Generate a spiral bullet pattern
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} count - Number of bullets
 * @param {number} speed - Bullet speed
 * @param {number} angleOffset - Starting angle offset
 * @param {number} spiralFactor - Spiral tightness
 * @returns {Array} Array of bullet objects
 */
export function generateSpiralPattern(x, y, count = 36, speed = 3, angleOffset = 0, spiralFactor = 0.1) {
  const bullets = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * (Math.PI * 2) / count) + angleOffset;
    const spiralAngle = angle + (i * spiralFactor);
    
    bullets.push({
      x,
      y,
      vx: Math.cos(spiralAngle) * speed,
      vy: Math.sin(spiralAngle) * speed,
      type: 'normal',
      damage: 1
    });
  }
  return bullets;
}

/**
 * Generate a ring bullet pattern
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} rings - Number of concentric rings
 * @param {number} bulletsPerRing - Bullets per ring
 * @param {number} speed - Bullet speed
 * @param {number} spread - Angle spread between rings
 * @returns {Array} Array of bullet objects
 */
export function generateRingPattern(x, y, rings = 3, bulletsPerRing = 12, speed = 4, spread = 0.2) {
  const bullets = [];
  for (let ring = 0; ring < rings; ring++) {
    const ringSpeed = speed * (1 + ring * 0.3);
    const ringOffset = ring * spread;
    
    for (let i = 0; i < bulletsPerRing; i++) {
      const angle = (i * (Math.PI * 2) / bulletsPerRing) + ringOffset;
      
      bullets.push({
        x,
        y,
        vx: Math.cos(angle) * ringSpeed,
        vy: Math.sin(angle) * ringSpeed,
        type: 'normal',
        damage: 1
      });
    }
  }
  return bullets;
}

/**
 * Generate a aimed shotgun pattern
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} targetX - Target x coordinate
 * @param {number} targetY - Target y coordinate
 * @param {number} spread - Spread angle in radians
 * @param {number} count - Number of bullets
 * @param {number} speed - Bullet speed
 * @returns {Array} Array of bullet objects
 */
export function generateShotgunPattern(x, y, targetX, targetY, spread = 0.5, count = 7, speed = 6) {
  const bullets = [];
  const baseAngle = Math.atan2(targetY - y, targetX - x);
  
  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (spread * (i / (count - 1) - 0.5));
    
    bullets.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      type: 'normal',
      damage: 1
    });
  }
  return bullets;
}

/**
 * Generate a laser beam attack
 * @param {number} x - Start x coordinate
 * @param {number} y - Start y coordinate
 * @param {number} width - Laser width
 * @param {number} length - Laser length
 * @param {number} angle - Laser angle in radians
 * @param {number} duration - Duration in frames
 * @returns {Object} Laser object
 */
export function generateLaserBeam(x, y, width = 20, length = 400, angle = -Math.PI/2, duration = 60) {
  return {
    x,
    y,
    width,
    length,
    angle,
    damage: 2,
    type: 'laser',
    duration,
    framesRemaining: duration,
    warning: true, // Show warning before firing
    warningTime: 30 // Warning duration in frames
  };
}

/**
 * Generate a curtain pattern (dense vertical/horizontal lines)
 * @param {number} startX - Start x coordinate
 * @param {number} startY - Start y coordinate
 * @param {number} endX - End x coordinate
 * @param {number} endY - End y coordinate
 * @param {number} count - Number of bullet lines
 * @param {number} speed - Bullet speed
 * @param {boolean} horizontal - Horizontal (true) or vertical (false) curtain
 * @returns {Array} Array of bullet objects
 */
export function generateCurtainPattern(startX, startY, endX, endY, count = 20, speed = 5, horizontal = false) {
  const bullets = [];
  const stepX = (endX - startX) / (count - 1);
  const stepY = (endY - startY) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    bullets.push({
      x: startX + (stepX * i),
      y: startY + (stepY * i),
      vx: horizontal ? 0 : speed,
      vy: horizontal ? speed : 0,
      type: 'normal',
      damage: 1
    });
  }
  return bullets;
}

/**
 * Generate a homing missile pattern
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} count - Number of missiles
 * @param {number} speed - Initial speed
 * @param {number} turnRate - Turn rate per frame
 * @returns {Array} Array of missile objects
 */
export function generateHomingMissiles(x, y, count = 4, speed = 2, turnRate = 0.05) {
  const missiles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * (Math.PI * 2) / count);
    
    missiles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      type: 'homing',
      damage: 2,
      turnRate,
      target: null, // Will be set to player position
      homing: true
    });
  }
  return missiles;
}

/**
 * Generate a wave pattern (sine wave bullets)
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} count - Number of bullets
 * @param {number} speed - Base speed
 * @param {number} amplitude - Wave amplitude
 * @param {number} frequency - Wave frequency
 * @returns {Array} Array of bullet objects
 */
export function generateWavePattern(x, y, count = 24, speed = 4, amplitude = 2, frequency = 0.1) {
  const bullets = [];
  for (let i = 0; i < count; i++) {
    const offset = (i / count) * Math.PI * 2;
    
    bullets.push({
      x,
      y,
      vx: Math.cos(offset) * speed,
      vy: Math.sin(offset) * speed + Math.sin(i * frequency) * amplitude,
      type: 'normal',
      damage: 1
    });
  }
  return bullets;
}

/**
 * Generate a random spread pattern
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} count - Number of bullets
 * @param {number} minSpeed - Minimum speed
 * @param {number} maxSpeed - Maximum speed
 * @returns {Array} Array of bullet objects
 */
export function generateRandomSpread(x, y, count = 16, minSpeed = 2, maxSpeed = 6) {
  const bullets = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    
    bullets.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      type: 'normal',
      damage: 1
    });
  }
  return bullets;
}

/**
 * Generate a targeted burst pattern (aimed at player with delay)
 * @param {number} x - Origin x coordinate
 * @param {number} y - Origin y coordinate
 * @param {number} targetX - Target x coordinate
 * @param {number} targetY - Target y coordinate
 * @param {number} bursts - Number of bursts
 * @param {number} bulletsPerBurst - Bullets per burst
 * @param {number} burstDelay - Delay between bursts (frames)
 * @param {number} speed - Bullet speed
 * @returns {Array} Array of burst objects with timing
 */
export function generateTargetedBurst(x, y, targetX, targetY, bursts = 3, bulletsPerBurst = 5, burstDelay = 20, speed = 5) {
  const burstPattern = [];
  const baseAngle = Math.atan2(targetY - y, targetX - x);
  
  for (let burst = 0; burst < bursts; burst++) {
    const burstTime = burst * burstDelay;
    const bullets = [];
    
    for (let i = 0; i < bulletsPerBurst; i++) {
      const spread = 0.3;
      const angle = baseAngle + (spread * (i / (bulletsPerBurst - 1) - 0.5));
      
      bullets.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'normal',
        damage: 1
      });
    }
    
    burstPattern.push({
      bullets,
      delay: burstTime
    });
  }
  
  return burstPattern;
}