#!/bin/sh

git -C $TRAVIS_BUILD_DIR diff --quiet && git -C $TRAVIS_BUILD_DIR diff --cached --quiet

if [ $? -ne 0 ]; then
	echo "DNS Blacklist requires update. Committing and Pushing."
	git -C $TRAVIS_BUILD_DIR commit -a -m 'Automated Update'
  git -C $TRAVIS_BUILD_DIR push
else
	echo "DNS Blacklist is already up-to-date!"
fi
