#!/bin/bash


git pull origin master

killall csycms.update.sh
./csycms.update.sh &

npm install
node bin/app.js