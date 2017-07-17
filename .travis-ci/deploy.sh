#!/bin/sh

# Setup SSH Keys
openssl aes-256-cbc -K $encrypted_b281b2f14922_key -iv $encrypted_b281b2f14922_iv -in .travis-ci/deploy.key.enc -out .travis-ci/deploy.key -d
chmod 400 .travis-ci/deploy.key
eval `ssh-agent -s`
ssh-add .travis-ci/deploy.key

# Setup Git
git config --global push.default simple
git config user.email "dev@oz.nu"
git config user.name "oznu"

# Add github remote
git remote add github git@github.com:oznu/dns-zone-blacklist.git

# Push any changes we made during build
git add .
git commit -a -m 'Automated Update' || echo "Blacklist Already Up-to-date"
git push github

# Clean up ssh
ssh-agent -k
