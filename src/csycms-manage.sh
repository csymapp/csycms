#!/bin/bash

# options
# create-site
# remove-site
# update-site
# list-sites


readConfig () {
    set -a
    source .env
    set +a
}


function listSites() {
    if test -f ".env"; then
        readConfig
        index=0;
        SITES_=()
        while IFS=',' read -ra SITE; do
            for i in "${SITE[@]}"; do
                # SITES_[$index]=$i
                tput setaf 2;
                echo "---------------"
                SITE=$(echo $i | cut -d \| -f 1)
                PORT=$(echo $i | cut -d \| -f 2)
                SITEREPO=$(echo $i | cut -d \| -f 3)
                DOMAIN=$(echo $i | cut -d \| -f 4)
                tput setaf 7;
                echo -n "SITE: "
                tput setaf 4;
                echo $SITE
                tput setaf 7;
                echo -n "PORT: "
                tput setaf 4; 
                echo $PORT
                tput setaf 7;
                echo -n "SITEREPO: "
                tput setaf 4;
                echo $SITEREPO
                TMP=$(grep domain "config/$SITE/system.config.js" | cut -d ":" -f 2 | sed -r 's/ //g'| sed -r "s/'//g")
                tput setaf 7;
                echo -n "DOMAIN: "
                tput setaf 4;
                echo $TMP
                SITES_[$index]=$i
                let "index++"
            done
        done <<< "$SITES"
        NUMSITES=$index
        echo "Number of sites: $index"

    else
        echo ".env file not found. Assuming 0 sites exist."
        echo "please make sure you run this from the root directory of your application"
    fi
}

case "$1" in
    'list-sites')
        listSites
    ;;
    
    'remove-site')
        listSites
        tput setaf 7;
        echo "Please enter the name of the site that you want to remove"
        tput setaf 2;
        read ans
        tput setaf 7;
        NEWSITES=()
        index=0;
        SITEFOUND=0
        for i in "${SITES_[@]}"; do
            SITE=$(echo $i | cut -d \| -f 1)
            if [ "$SITE" = "$ans" ] ; then
                SITEFOUND=1
            else
                NEWSITES[$index]=$i
                let "index++"
            fi

        done
        [ "$SITEFOUND" == "0" ] && {
            tput setaf 1;
            echo "site $ans not found! Please try again." 
            
        } || {  
            tput setaf 2;
            echo "Removing site..."
            envLine=$(IFS=, ; echo "${NEWSITES[*]}")
            sed -i '1d' .env
            echo -e "SITES=\"$envLine\"\n$(cat .env)" > .env
            rm -rf "config/$ans"
            rm -rf "content/$ans"
            rm -rf "layouts/$ans"
            rm -rf "public/sites/$ans"
            echo "site $ans removed"
  
        } 
        tput setaf 4
    ;;
    
    'create-site')
        tput bold;  
        echo -n "Enter Site name: "
        tput sgr0
        tput setaf 2;
        read ans
        NEWSITENAME=$ans
        tput setaf 7;
        tput bold;  
        echo -n "Enter PORT for running the site: "
        tput sgr0
        tput setaf 2;
        read ans
        NEWPORT=$ans
        tput setaf 7;
        echo -n "Enter site repo (if you want us to pull site from github) or just press enter to create a new site from templates"
        tput sgr0
        tput setaf 2;
        read ans
        NEWSITEREPO=$ans
        tput setaf 7;
        echo -n "site domain/ipaddress? (localhost):"
        tput sgr0
        tput setaf 2;
        read ans
        NEWSITEDOMAIN=$ans
        tput setaf 7;

        # check that site name and port are not already in use...
        listSites
        NEWSITES=()
        index=0;
        SITEFOUND=0
        PORTFOUND=0
        for i in "${SITES_[@]}"; do
            SITE=$(echo $i | cut -d \| -f 1)
            if [ "$SITE" = "$NEWSITENAME" ] ; then
                SITEFOUND=1
            fi
            PORT=$(echo $i | cut -d \| -f 2)
            if [ "$PORT" = "$NEWPORT" ] ; then
                PORTFOUND=1
            fi

        done
        ERR=0
        [ "$SITEFOUND" == "1" ] && {
            tput setaf 1;
            echo "site $NEWSITENAME already exists!" 
            ERR=1
            # exit 1
            
        }

        [ "$PORTFOUND" == "1" ] && {
            tput setaf 1;
            echo "PORT $NEWPORT already in use!" 
            ERR=1
            # exit 1
            
        }
        [ "$PORTFOUND" == "1" ] && {
            exit 100
        }
        # add to config line
       

        [ "$NEWSITEREPO" == "" ] && {
            echo "not getting from github...."
            NEWSITEREPO="git@github.com:csymapp/csycms-site.git"
            # require site_template
        } 
        [ "$NEWSITEDOMAIN" == "" ] && {
            NEWSITEDOMAIN=$(echo "localhost:$NEWPORT")
        } 

        let "NUMSITES++"
        SITES_[$NUMSITES]=$( echo "$NEWSITENAME|$NEWPORT|$NEWSITEREPO")
        envLine=$(IFS=, ; echo "${SITES_[*]}")
        sed -i '1d' .env
        echo -e "SITES=\"$envLine\"\n$(cat .env)" > .env 

        # create content dir
        mkdir -p "content/$NEWSITENAME"
        # create config file
        mkdir -p "config/$NEWSITENAME"
        mkdir -p "public/sites/$NEWSITENAME"
        mkdir -p "layouts/$NEWSITENAME"
        
        
        cd "content/$NEWSITENAME"
        {
            git clone $NEWSITEREPO . && cp ../../config/system.config.example "../../config/$NEWSITENAME/system.config.js"
        } || git pull origin master
        
        cd ../..
        {
            # cp -r "content/$1/public/content" "content/$1"
            #cp -r "content/$NEWSITENAME/public/config/"* "config/$NEWSITENAME"
            cp -r "content/$NEWSITENAME/public/public/"* "public/sites/$NEWSITENAME"
            cp -r "content/$NEWSITENAME/public/layouts/"* "layouts/$NEWSITENAME"
        } || echo -n""
        
        cd "content/$NEWSITENAME"
        mkdir -p csycmsdocs
        cd csycmsdocs
        {
            git clone $CSYCMSDOCSREPO .
        } ||     git pull origin master
        
        cd ../../..
        find "config/$NEWSITENAME/system.config.js" -type f -exec sed -i "s/domain: 'csycms.csymapp.com'/domain: '$NEWSITEDOMAIN'/g" {} \;
        find "config/$NEWSITENAME/system.config.js" -type f -exec sed -i "s/site: 'csycms'/site: '$NEWSITENAME'/g" {} \;
        find "config/$NEWSITENAME/system.config.js" -type f -exec sed -i "s/site_title: 'CSYMS Docs'/site_title: '$NEWSITENAME'/g" {} \;

        tput setaf 2;
        echo "The site that has been created is simply a clone of csycms website. You may have to change the remote later."
        echo "You may also have to manually edit some configurations in config/$NEWSITENAME/system.config.js"
        echo "In case you change your mind about some of the details you supplied, you can also manually edit these in .env"

    ;;
    'update-site')
        listSites
        tput setaf 7;
        echo "Please enter the name of the site that you want to update"
        tput setaf 2;
        read ans
        tput setaf 7;
        NEWSITES=()
        index=0;
        SITEFOUND=0
        for i in "${SITES_[@]}"; do
            SITE=$(echo $i | cut -d \| -f 1)
            if [ "$SITE" = "$ans" ] ; then
                SITEFOUND=1
            else
                NEWSITES[$index]=$i
                let "index++"
            fi

        done
        [ "$SITEFOUND" == "0" ] && {
            tput setaf 1;
            echo "site $ans not found! Please try again." 
            
        } || {  
            tput setaf 2;
            echo "Updating site..."
    
            # rm -rf "/tmp/csycms/$ans"
            # mkdir -p "/tmp/csycms/"
            # cp -r "content/$ans" "/tmp/csycms/"
            mkdir -p "content/$ans/public/"
            #cp -r "config/$ans/"* "content/$ans/public/config"
            cp -r "public/sites/$ans/"* "content/$ans/public/public"
            cp -r "layouts/$ans/"* "content/$ans/public/layouts"
            
            cd "content/$ans/"
            tput setaf 7;
            echo -n "commit message?(commit):"
            tput setaf 2;
            read message
            [ "$message" == "" ] && message="commit"
            git add .
            git commit -m "$message"
            git remote -v
            git push origin master
  
        } 
        tput setaf 4
    ;;
    'run-site')
        listSites
        tput setaf 7;
        ans=$2
        tput setaf 7;
        NEWSITES=()
        index=0;
        SITEFOUND=0
        for i in "${SITES_[@]}"; do
            SITE=$(echo $i | cut -d \| -f 1)
            PORT=$(echo $i | cut -d \| -f 2)
            if [ "$SITE" = "$ans" ] ; then
                SITEFOUND=1
                RUNSITE=$SITE
                RUNPORT=$PORT
            else
                NEWSITES[$index]=$i
                let "index++"
            fi

        done
        [ "$SITEFOUND" == "0" ] && {
            tput setaf 1;
            echo "site $ans not found! Please try again." 
            
        } || {  
            SITE=$RUNSITE PORT=$RUNPORT nodemon bin/app.js || SITE=$RUNSITE PORT=$RUNPORT node bin/app.js
        }
    ;;
    
    *)
        echo $"Usage: $0 {create-site|remove-site|update-site|list-sites|run-site sitename}"
        exit 1
        
esac