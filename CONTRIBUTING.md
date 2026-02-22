# Contributing to MerterBlaster

Thank you for your interest in contributing to MerterBlaster! This document provides guidelines and instructions for contributing to this retro arcade shooter project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## How Can I Contribute?

### Reporting Bugs
- Check if the bug has already been reported in the [Issues](https://github.com/[your-username]/merterblaster/issues)
- Use the bug report template when creating a new issue
- Include steps to reproduce, expected behavior, and actual behavior
- Include screenshots or videos if applicable
- Specify your browser and OS version

### Suggesting Enhancements
- Check if the enhancement has already been suggested
- Use the feature request template
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### Pull Requests
1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Ensure your code follows the style guide
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation
```bash
git clone https://github.com/[your-username]/merterblaster.git
cd merterblaster
npm install
```

### Running Locally
```bash
npm start
# or
npm run dev
```

### Testing
```bash
npm test          # Run all tests
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage
```

### Code Quality
```bash
npm run lint      # Check code style
npm run format    # Format code
```

## Project Structure

```
merterblaster/
├── index.html          # Main HTML file
├── game.js            # Game engine and logic
├── style.css          # Styles and CRT effects
├── service-worker.js  # PWA service worker
├── manifest.json      # PWA manifest
├── assets/            # Game assets
│   ├── images/        # Sprites and backgrounds
│   ├── sounds/        # Sound effects
│   └── music/         # Background music
├── tests/             # Test files
├── docs/              # Documentation
└── .github/           # GitHub workflows
```

## Coding Standards

### JavaScript
- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### CSS
- Use BEM naming convention
- Keep styles organized by component
- Use CSS variables for theming
- Mobile-first responsive design

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Example:
```
feat: Add new enemy type

- Add flying saucer enemy with zigzag movement pattern
- Implement collision detection for new enemy
- Add sound effects for enemy destruction

Closes #123
```

## Game Development Guidelines

### Adding New Features
1. **Game Mechanics**: Keep gameplay balanced and fun
2. **Performance**: Maintain 60 FPS on target devices
3. **Accessibility**: Ensure game is playable for everyone
4. **Mobile Support**: Test on mobile devices

### Asset Creation
- **Sprites**: Use 16x16 or 32x32 pixel art style
- **Sounds**: 8-bit/16-bit retro style
- **Music**: FM synth style, loopable
- **Optimization**: Compress assets for web delivery

### Testing Requirements
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices (iOS, Android)
- Test with different input methods (keyboard, touch, gamepad)
- Test performance on low-end devices

## Review Process

1. **Automated Checks**: All PRs must pass CI checks
2. **Code Review**: At least one maintainer must approve
3. **Testing**: PR author should test their changes thoroughly
4. **Documentation**: Update documentation if needed

## Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Tag Release**: Create git tag
4. **Deploy**: Automated deployment to GitHub Pages
5. **Announce**: Share release on appropriate channels

## Getting Help

- Check the [README](README.md) for basic information
- Look at existing issues and pull requests
- Ask questions in discussions or issues
- Join our community Discord (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MerterBlaster! 🚀