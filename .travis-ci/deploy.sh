#!/bin/sh
set -x

# Setup Git
git config --global user.email "dev@oz.nu"
git config --global user.name "oznu"
git -C $TRAVIS_BUILD_DIR remote set-url origin git@github.com:oznu/dns-zone-blacklist.git

# Check to see if we made any changes
git -C $TRAVIS_BUILD_DIR diff --quiet && git -C $TRAVIS_BUILD_DIR diff --cached --quiet

if [ $? -ne 0 ]; then
  # Commit and push changes
  echo "DNS Blacklist requires update. Committing and Pushing."
  git -C $TRAVIS_BUILD_DIR commit -a -m 'Automated Update'
  git -C $TRAVIS_BUILD_DIR push origin $BRANCH
else
  # No changes made
  echo "DNS Blacklist is already up-to-date!"
fi
