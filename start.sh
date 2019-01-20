#!/bin/bash

# git pull origin master
# npm install

# import
. src/functions.sh

readConfig

SITES_=()
PROCESS_IDS=()
index=0;

# list of sites
while IFS=',' read -ra SITE; do
    for i in "${SITE[@]}"; do
        SITES_[$index]=$i
        let "index++"
    done
done <<< "$SITES"

printf '%s\n' "${SITES_[@]}"

stopChildren() {
    kill $UPDATE_PROC_ID
    for i in "${PROCESS_IDS[@]}"; do
        kill $i
        echo "Stopped: $i"
    done
}

setUpThemes

index=0;
for i in "${SITES_[@]}"; do
    monitors $i $index &
    PROC_ID_A=$!
    PROCESS_IDS[$index]=$PROC_ID_A
    let "index++"
    
    # updates $i $index &
    # PROC_ID_A=$!
    # PROCESS_IDS[$index]=$PROC_ID_A
    # let "index++"

done

csystemUpdates &
PROC_ID_UPDATE=$!
PROCESS_IDS[$index]=$PROC_ID_UPDATE


printf '%s|' "${PROCESS_IDS[@]}"

# If this script is killed, stop the children.
trap "stopChildren" EXIT

wait 