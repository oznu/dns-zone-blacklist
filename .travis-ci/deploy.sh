#!/bin/sh

# Setup Git
git config --global user.email "dev@oz.nu"
git config --global user.name "oznu"

# Clone a fresh instance using the current branch
git clone -b $BRANCH --depth=2 git@github.com:oznu/dns-zone-blacklist.git $TRAVIS_BUILD_DIR/travis-build-dir
cd $TRAVIS_BUILD_DIR/travis-build-dir

# Install dependencies
yarn install

# Build Blacklist
echo "Optimising blacklist, this might take a few minutes..."
node build/index.js --silent

# Check to see if we made any changes
git diff --quiet && git diff --cached --quiet
if [ $? -ne 0 ]; then
  # Commit and push changes
  echo "DNS Blacklist requires update. Committing and Pushing."
  git add .
  git commit -a -m 'Automated Update'
  git push
else
  # No changes made
  echo "DNS Blacklist is already up-to-date!"
fi
