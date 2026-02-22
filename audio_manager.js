        gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        
        oscillator1.start();
        oscillator2.start();
        
        oscillator1.stop(this.context.currentTime + duration);
        oscillator2.stop(this.context.currentTime + duration);
        
        return { oscillator1, oscillator2, gainNode };
    }
}

// Global audio manager instance
let audioManager = null;

// Initialize audio system
function initAudio() {
    if (!audioManager) {
        audioManager = new AudioManager();
        
        // Auto-resume audio context on user interaction
        document.addEventListener('click', () => {
            if (audioManager.audioContext.state === 'suspended') {
                audioManager.audioContext.resume();
            }
        });
        
        // Preload essential sounds
        audioManager.preloadEssentialSounds().then(() => {
            console.log('Essential sounds preloaded');
        }).catch(error => {
            console.warn('Could not preload sounds:', error);
        });
        
        audioManager.preloadEssentialMusic().then(() => {
            console.log('Essential music preloaded');
        }).catch(error => {
            console.warn('Could not preload music:', error);
        });
        
        audioManager.preloadEssentialVoices().then(() => {
            console.log('Essential voices preloaded');
        }).catch(error => {
            console.warn('Could not preload voices:', error);
        });
    }
    return audioManager;
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioManager, FMSynth, initAudio };
}