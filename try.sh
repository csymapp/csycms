#!/bin/bash

# Bash loop through directories


SITES_=()
while IFS=',' read -ra SITE; do
    for i in "${SITE[@]}"; do
        SITES_[$index]=$i
        let "index++"
    done
done <<< "$SITES"

printf '%s\n' "${SITES_[@]}"
