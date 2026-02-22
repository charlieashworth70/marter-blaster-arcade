#!/bin/bash

# MerterBlaster GitHub Repository Setup Script
# This script helps set up the GitHub repository and initial deployment

set -e  # Exit on error

echo "🚀 MerterBlaster GitHub Setup Script"
echo "====================================="

# Check for required tools
command -v git >/dev/null 2>&1 || { echo "Git is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting." >&2; exit 1; }

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Check if remote is configured
if ! git remote | grep -q origin; then
    echo "⚠️  No remote repository configured."
    echo "Please create a repository on GitHub and run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/merterblaster.git"
    echo "Then run this script again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run tests
echo "Running tests..."
npm test

# Lint code
echo "Checking code quality..."
npm run lint

# Create initial commit if needed
if [ -z "$(git status --porcelain)" ]; then
    echo "Working directory clean."
else
    echo "Creating initial commit..."
    git add .
    git commit -m "Initial commit: MerterBlaster arcade shooter"
fi

# Push to main branch
echo "Pushing to GitHub..."
git push -u origin main

# Set up GitHub Pages
echo ""
echo "📝 GitHub Pages Setup Instructions:"
echo "====================================="
echo "1. Go to your repository on GitHub"
echo "2. Click 'Settings' → 'Pages'"
echo "3. Under 'Source', select:"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "4. Click 'Save'"
echo ""
echo "Your game will be available at:"
echo "https://YOUR_USERNAME.github.io/merterblaster/"
echo ""
echo "🎮 Game Development Commands:"
echo "============================="
echo "npm start          # Start development server"
echo "npm run dev        # Live reload development"
echo "npm test           # Run tests"
echo "npm run lint       # Check code style"
echo "npm run format     # Format code"
echo ""
echo "✅ Setup complete! Happy coding! 🚀"