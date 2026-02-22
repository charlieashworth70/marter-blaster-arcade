// Touch Controls for MarterBlaster
class TouchControls {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.player = game.player;
    
    // Virtual joystick properties
    this.joystick = {
      active: false,
      x: 0,
      y: 0,
      radius: 60,
      baseX: 0,
      baseY: 0,
      handleX: 0,
      handleY: 0,
      maxDistance: 40
    };
    
    // Fire button properties
    this.fireButton = {
      x: 0,
      y: 0,
      radius: 40,
      active: false
    };
    
    // Touch tracking
    this.touches = new Map();
    
    // Initialize controls
    this.init();
  }
  
  init() {
    // Set up touch event listeners
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Set up orientation change listener
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Position controls based on screen size
    this.positionControls();
  }
  
  positionControls() {
    const canvasRect = this.canvas.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;
    
    // Position joystick on left side
    this.joystick.baseX = canvasWidth * 0.15;
    this.joystick.baseY = canvasHeight * 0.8;
    this.joystick.x = this.joystick.baseX;
    this.joystick.y = this.joystick.baseY;
    this.joystick.handleX = this.joystick.baseX;
    this.joystick.handleY = this.joystick.baseY;
    
    // Position fire button on right side
    this.fireButton.x = canvasWidth * 0.85;
    this.fireButton.y = canvasHeight * 0.8;
  }
  
  handleTouchStart(event) {
    event.preventDefault();
    const canvasRect = this.canvas.getBoundingClientRect();
    
    for (let touch of event.changedTouches) {
      const touchX = touch.clientX - canvasRect.left;
      const touchY = touch.clientY - canvasRect.top;
      const touchId = touch.identifier;
      
      // Check if touch is near joystick
      const joystickDist = Math.sqrt(
        Math.pow(touchX - this.joystick.baseX, 2) + 
        Math.pow(touchY - this.joystick.baseY, 2)
      );
      
      if (joystickDist < this.joystick.radius) {
        this.joystick.active = true;
        this.touches.set(touchId, 'joystick');
        this.updateJoystick(touchX, touchY);
      }
      // Check if touch is near fire button
      else if (Math.sqrt(
        Math.pow(touchX - this.fireButton.x, 2) + 
        Math.pow(touchY - this.fireButton.y, 2)
      ) < this.fireButton.radius) {
        this.fireButton.active = true;
        this.touches.set(touchId, 'fire');
        this.game.fireLaser();
      }
    }
  }
  
  handleTouchMove(event) {
    event.preventDefault();
    const canvasRect = this.canvas.getBoundingClientRect();
    
    for (let touch of event.changedTouches) {
      const touchId = touch.identifier;
      const controlType = this.touches.get(touchId);
      
      if (controlType === 'joystick') {
        const touchX = touch.clientX - canvasRect.left;
        const touchY = touch.clientY - canvasRect.top;
        this.updateJoystick(touchX, touchY);
      }
    }
  }
  
  handleTouchEnd(event) {
    event.preventDefault();
    
    for (let touch of event.changedTouches) {
      const touchId = touch.identifier;
      const controlType = this.touches.get(touchId);
      
      if (controlType === 'joystick') {
        this.resetJoystick();
      } else if (controlType === 'fire') {
        this.fireButton.active = false;
      }
      
      this.touches.delete(touchId);
    }
  }
  
  updateJoystick(touchX, touchY) {
    const dx = touchX - this.joystick.baseX;
    const dy = touchY - this.joystick.baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.joystick.maxDistance) {
      this.joystick.handleX = touchX;
      this.joystick.handleY = touchY;
    } else {
      const angle = Math.atan2(dy, dx);
      this.joystick.handleX = this.joystick.baseX + Math.cos(angle) * this.joystick.maxDistance;
      this.joystick.handleY = this.joystick.baseY + Math.sin(angle) * this.joystick.maxDistance;
    }
    
    // Calculate movement direction
    const moveX = (this.joystick.handleX - this.joystick.baseX) / this.joystick.maxDistance;
    
    // Update player position
    const canvasWidth = this.canvas.width;
    const playerWidth = this.player.width;
    const newX = this.player.x + (moveX * this.player.speed * 2);
    
    // Keep player within bounds
    this.player.x = Math.max(
      playerWidth / 2,
      Math.min(canvasWidth - playerWidth / 2, newX)
    );
  }
  
  resetJoystick() {
    this.joystick.active = false;
    this.joystick.handleX = this.joystick.baseX;
    this.joystick.handleY = this.joystick.baseY;
  }
  
  handleOrientationChange() {
    // Recalculate control positions after orientation change
    setTimeout(() => {
      this.positionControls();
      this.game.handleResize();
    }, 100);
  }
  
  handleResize() {
    this.positionControls();
  }
  
  draw(ctx) {
    // Draw joystick
    ctx.save();
    
    // Joystick base
    ctx.fillStyle = 'rgba(0, 247, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(this.joystick.baseX, this.joystick.baseY, this.joystick.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Joystick handle
    ctx.fillStyle = this.joystick.active ? 'rgba(255, 0, 234, 0.8)' : 'rgba(0, 247, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.joystick.handleX, this.joystick.handleY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Fire button
    ctx.fillStyle = this.fireButton.active ? 'rgba(255, 0, 234, 0.8)' : 'rgba(255, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(this.fireButton.x, this.fireButton.y, this.fireButton.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Fire button icon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(this.fireButton.x - 15, this.fireButton.y);
    ctx.lineTo(this.fireButton.x + 15, this.fireButton.y);
    ctx.lineTo(this.fireButton.x, this.fireButton.y - 20);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}

export default TouchControls;