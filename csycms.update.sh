#!/bin/bash

readConfig () {
    set -a
    source .env
    set +a
}

readConfig

checktime=$UPDATEINTERVAL #1 hour	 #time in minutes after which to check for new software

#times in seconds
checktime=$((checktime * 60))

GIT=$(git log|head)
GITOLD="$(echo $GIT | cut -d' ' -f2)"


sudo mkdir -p content
cd content
sudo git clone $SITEREPO .
GITSITE=$(git log|head)
GITOLDSITE="$(echo $GITSITE | cut -d' ' -f2)"

cd ..

sudo mkdir -p content/csycmsdocs
cd content/csycmsdocs
sudo git clone $CSYCMSDOCSREPO .
GITCSYCMSDOCS=$(git log|head)
GITOLDCSYCMSDOCS="$(echo $GITCSYCMSDOCS | cut -d' ' -f2)"

cd ../..

while :
do
    {
        sleep $checktime
        sudo git pull origin master
        GIT=$(git log|head)
        
        cd content
        sudo git pull origin master
        GITSITE=$(git log|head)
        
        cd ..
        
        cd content/csycmsdocs
        sudo git pull origin master
        GITCSYCMSDOCS=$(git log|head)
        
        GITOLDSITE="$(echo $GITSITE | cut -d' ' -f2)"
        GITNEWSITE="$(echo $GIT | cut -d' ' -f2)"
        GITOLDCSYCMSDOCS="$(echo $GGITCSYCMSDOCSIT | cut -d' ' -f2)"
        
        [ "$GITOLD" == "$GITNEW" ] || systemctl restart csycms.service
        [ "$GITOLDSITE" == "$GITNEWSITE" ] || systemctl restart csycms.service
        [ "$GITOLDCSYCMSDOCS" == "$GITCSYCMSDOCS" ] || systemctl restart csycms.service
        
    }
done