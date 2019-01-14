#!/bin/bash

checktime=60 #1 hour	 #time in minutes after which to check for new software

#times in seconds
checktime=$((checktime * 60))

GIT=$(git log|head)
GITOLD="$(echo $GIT | cut -d' ' -f2)"

while :	
do
   {
   		sleep $checktime
   		git pull origin master
        GIT=$(git log|head)
        GITNEW="$(echo $GIT | cut -d' ' -f2)"

        [ "$GITOLD" == "$GITNEW" ] || systemctl restart csycms.service
   }
done