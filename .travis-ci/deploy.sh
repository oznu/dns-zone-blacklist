#!/bin/sh

git -C $WORK_DIR diff --quiet && git -C $WORK_DIR diff --cached --quiet

if [ $? -ne 0 ]; then
	echo "DNS Blacklist requires update. Committing and Pushing."
	# git -C $WORK_DIR commit -a -m 'Automated Update'
  #      git -C $WORK_DIR push
else
	echo "DNS Blacklist is already up-to-date!"
fi
