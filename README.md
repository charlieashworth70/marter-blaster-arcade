# Marter Blaster Arcade 🚀

A retro 1990s-style arcade shooter built with modern web technologies. Experience authentic 90s arcade gameplay with polished visuals, killer sound, and mobile-friendly controls.

![Game Screenshot](assets/images/screenshot.png)

## Features

- **Authentic 90s Arcade Gameplay**: Inspired by classics like R-Type, Gradius, and Raiden
- **Mobile & Desktop Ready**: Responsive design with touch and keyboard controls
- **Progressive Web App**: Installable on mobile devices
- **CRT Filter**: Authentic retro visual effects
- **Original Soundtrack**: FM synth-style music and sound effects
- **Leaderboards**: Compete for high scores

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/charlieashworth70/marter-blaster-arcade.git
   cd marter-blaster-arcade
   ```

2. **Open in browser**
   ```bash
   # Using Python
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Or use a local server**
   - Any static file server will work
   - No build step required!

## Development

### Project Structure
```
merterblaster/
├── index.html          # Main HTML file
├── game.js            # Game engine and logic
├── style.css          # Styles and CRT effects
├── service-worker.js  # PWA service worker
├── manifest.json      # PWA manifest
├── assets/            # Game assets (images, sounds)
│   ├── images/
│   ├── sounds/
│   └── music/
├── docs/              # Documentation
└── tests/             # Test files
```

### Adding Features
1. **New enemies**: Add to `enemies` array in `game.js`
2. **Power-ups**: Implement in `updatePowerups()` function
3. **Levels**: Extend `loadLevel()` function

## Deployment

### GitHub Pages
The game is automatically deployed to GitHub Pages when pushing to `main` branch.

**Live URL**: https://charlieashworth70.github.io/marter-blaster-arcade/ 🎮

**Status**: DEPLOYED ✅

### Manual Deployment
1. Build (if needed): `npm run build`
2. Deploy to any static hosting:
   - Netlify
   - Vercel
   - Cloudflare Pages
   - AWS S3

## Controls

### Desktop
- **Arrow Keys**: Move ship
- **Spacebar**: Shoot
- **P**: Pause game
- **M**: Toggle music

### Mobile/Touch
- **Touch left/right**: Move ship
- **Touch center**: Shoot
- **Buttons**: Pause, mute, restart

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Workflow

We use GitHub Actions for:
- ✅ Automated testing
- ✅ Code linting
- ✅ Automatic deployment to GitHub Pages
- ✅ Performance monitoring

## Tech Stack

- **HTML5 Canvas**: Game rendering
- **Vanilla JavaScript**: Game logic
- **CSS3**: Styling and animations
- **Service Workers**: Offline capability
- **Web Audio API**: Sound and music

## Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: < 500KB
- **Offline Support**: Full PWA capabilities

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile Safari 11+
- Chrome for Android 60+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by 90s arcade classics
- CRT filter based on [CRT Screen Effects](https://css-tricks.com/old-timey-terminal-styling/)
- Sound effects generated with [jsfxr](https://sfxr.me/)

---

**Made with ❤️ for retro gaming enthusiasts**