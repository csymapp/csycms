readConfig () {
    set -a
    source .env
    set +a
}

# CHILD_PROCESS_IDS=()
setUpThemes () {
    readConfig
    
    mkdir -p themes
    cd themes
    {
        git clone $THEMESREPO .
    } || git pull origin master
    # copy themes public dirs to public
    mkdir ../public/themes
    for d in */ ; do
        mkdir -p "../public/themes/$d"
        # echo "$d"public/*
        # echo "$d"public/*
        # echo "$d"public/*
        cp -r "$d"public/* "../public/themes/$d"

        # echo "$d"templates/*
        cp -u "$d"templates/* ../layouts/*/"$d"
    done
    exit
    cd ..
}

csystemUpdates () {
    checktime=$(($UPDATEINTERVAL * 60))
    # create some offset of 120 seconds
    sleep $((2 * 60))
    while : 
    do
        {
            GITOLD=$(git log|head)
            git pull origin master
            GITNEW=$(git log|head)

            cd themes/
            GITOLDTHEME=$(git log|head)
            git pull origin master
            GITNEWTHEME=$(git log|head)

            cd ..
            
            [ "$GITOLD" == "$GITNEW" ] || systemctl restart csycms.service 
            [ "$GITOLDTHEME" == "$GITNEWTHEME" ] || systemctl restart csycms.service 
            sleep $checktime
        }
    done
}

siteUpdates () {
    checktime=$(($UPDATEINTERVAL * 60))
    CONFIG=$1
    index=$2
    SITE=$(echo $CONFIG | cut -d \| -f 1)
    PORT=$(echo $CONFIG | cut -d \| -f 2)
    SITEREPO=$(echo $CONFIG | cut -d \| -f 3)
    DOMAIN=$(echo $CONFIG | cut -d \| -f 4)
    
    cd "content/$SITE"
    while : 
    do
        {
            GITSITEOLD=$(git log|head)
            git pull origin master
            GITSITENEW=$(git log|head)

            cd csycmsdocs
            GITCSYCMSDOCSOLD=$(git log|head)
            git pull origin master
            GITCSYCMSDOCSNEW=$(git log|head)

            cd ..
            
            [ "$GITCSYCMSDOCSOLD" == "$GITCSYCMSDOCSNEW" ] || kill $3 # restart ndividual sub process
            [ "$GITSITEOLD" == "$GITSITENEW" ] || kill $3 # restart ndividual sub process
            sleep $checktime
        }
    done
}



setUpSite () {
    readConfig
    pwd
    mkdir -p config
    cp -r config.example/* config/
    
    mkdir -p "content/$1"
    mkdir -p "config/$1"
    mkdir -p "public/sites/$1"
    mkdir -p "layouts/$1"
    
    
    cd "content/$1"
    {
        git clone $2 .
        FILE="../../config/$1/system.config.js"
        if [ ! -f "$FILE" ]; then
            cp ../../config/system.config.example "../../config/$1/system.config.js"
        fi 
        
    } || git pull origin master
    
    cd ../..
    {
        # cp -r "content/$1/public/content" "content/$1"
        #cp -r "content/$1/public/config/"* "config/$1"
        cp -r "content/$1/public/public/"* "public/sites/$1"
        cp -r "content/$1/public/layouts/"* "layouts/$1"
    } || echo -n""
    
    cd "content/$1"
    mkdir -p csycmsdocs
    cd csycmsdocs
    {
        git clone $CSYCMSDOCSREPO .
    } ||     git pull origin master
    
    cd ../../..
    
}

stopOtherChildren () {
    if [[ "" !=  "$1" ]]; then
    kill -9 $1
    fi
    
    if [[ "" !=  "$2" ]]; then
    kill -9 $2
    fi
    
}

monitors () {
    set -o monitor # for SIGCHLD
    CONFIG=$1
    index=$2
    SITE=$(echo $CONFIG | cut -d \| -f 1)
    PORT=$(echo $CONFIG | cut -d \| -f 2)
    SITEREPO=$(echo $CONFIG | cut -d \| -f 3)
    DOMAIN=$(echo $CONFIG | cut -d \| -f 4)
    
    setUpSite $SITE $SITEREPO

    echo "PORT=$PORT SITE=$SITE node bin/app.js --SITE=$SITE &"

    
    PORT=$PORT SITE=$SITE  node bin/app.js --SITE=$SITE &
    PROC_ID=$!
    
    siteUpdates $1 $2 $PROC_ID &
    UPDATE_PROC_ID=$!

    echo "$SITE: $PORT: $PROC_ID: $UPDATE_PROC_ID"
    
    trap "stopOtherChildren $PROC_ID $UPDATE_PROC_ID && echo stopping $PROC_ID and $UPDATE_PROC_ID" EXIT
    trap "stopOtherChildren $PROC_ID $UPDATE_PROC_ID && echo stopping $PROC_ID and $UPDATE_PROC_ID" SIGCHLD

    wait
    
    monitors $CONFIG $index
    
}