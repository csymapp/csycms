#!/bin/bash

# git pull origin master

# ./csycms.update.sh &
# UPDATE_PROC_ID=$!

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

index=0;
for i in "${SITES_[@]}"; do
    monitors $i $index &
    PROC_ID_A=$!
    PROCESS_IDS[$index]=$PROC_ID_A
    let "index++"
done

printf '%s|' "${PROCESS_IDS[@]}"
echo ""

# If this script is killed, stop the children.
trap "stopChildren" EXIT

wait 