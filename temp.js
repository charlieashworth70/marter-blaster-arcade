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