#!/bin/bash
# Script to push marter-blaster-arcade to GitHub and enable GitHub Pages

echo "=== Pushing marter-blaster-arcade to GitHub ==="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the marter-blaster-arcade directory"
    exit 1
fi

# Check git status
echo "Checking git status..."
git status

# Add all changes
echo "Adding all changes..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit: Marter Blaster Arcade v1.0 with GitHub Pages configuration"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Repository pushed successfully! ==="
echo ""
echo "GitHub Repository: https://github.com/charlieashworth70/marter-blaster-arcade"
echo ""
echo "GitHub Pages will be automatically deployed via GitHub Actions."
echo "Once the deployment completes, your game will be available at:"
echo "https://charlieashworth70.github.io/marter-blaster-arcade/"
echo ""
echo "You can check the deployment status in the Actions tab of the repository."