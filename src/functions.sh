readConfig () {
    set -a
    source .env
    set +a
}

# CHILD_PROCESS_IDS=()
setUpSite () {
    readConfig
    mkdir -p "content/$1"
    mkdir -p "config/$1"
    mkdir -p "public/$1"

    cd "content/$1"
    git clone $2 .
    git pull origin master

    cd ../..

    cp -r "content/$1/public/content" "content/$1"
    cp -r "content/$1/public/config" "config/$1"
    cp -r "content/$1/public/public" "public/$1"

    cd "content/$1"
    mkdir -p csycmsdocs
    cd csycmsdocs
    git clone $CSYCMSDOCSREPO .
    git pull origin master

    cd ../../..

    mkdir -p themes
    cd themes
    git clone $THEMESREPO .  
    git pull origin master  
    
}

setUpSites () {

}

monitors () {
    CONFIG=$1
    index=$2
    SITE=$(echo $i | cut -d: -f 1)
    PORT=$(echo $i | cut -d: -f 2)

    setUpSite $SITE

    PORT=$PORT node bin/app.js &
    PROC_ID=$!
    echo "$SITE: $PORT: $PROC_ID"
    # CHILD_PROCESS_IDS[$index]=$PROC_ID

    trap "kill $PROC_ID && echo stopping $PROC_ID" EXIT
    wait
    monitors $CONFIG $index
    
}