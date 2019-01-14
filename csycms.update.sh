#!/bin/bash

checktime=60 #1 hour	 #time in minutes after which to check for new software

#times in seconds
checktime=$((checktime * 60))

GIT=$(git log|head)
GITOLD="$(echo $GIT | cut -d' ' -f2)"

readConfig () {
    set -a
    source ../.env
    set +a
}

readConfig


mkdir -p content
cd content
git clone $SITEREPO .

GITSITE=$(git log|head)
GITOLDSITE="$(echo $GITSITE | cut -d' ' -f2)"

cd ..

while :
do
    {
        sleep $checktime
        git pull origin master
        GIT=$(git log|head)
        
        cd content
        git pull origin master
        GITSITE=$(git log|head)

        GITOLDSITE="$(echo $GITSITE | cut -d' ' -f2)" 
        GITNEWSITE="$(echo $GIT | cut -d' ' -f2)"
        
        [ "$GITOLD" == "$GITNEW" ] || systemctl restart csycms.service
        [ "$GITOLDSITE" == "$GITNEWSITE" ] || systemctl restart csycms.service
        
        mkdir -p
    }
done