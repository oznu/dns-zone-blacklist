#!/bin/sh

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
