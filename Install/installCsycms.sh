#!/bin/bash

configureEnv?() {
    nano .env
}

editFile?() {
    nano $1
}

pass() {
    echo "done"
}


#
# ask a Yes/No question
# usage: askYesNoQuestion "question" function_to_run_if_answer_is_yes
# valid answers are Yes/No. askYesNoQuestion will loop until it gets valid answer
#
askYesNoQuestion() {
    user=$(whoami)
    tput bold;  echo -n "Mr. Brian: "; tput sgr0
    echo "$1"
    # tput rev;   echo "Mr. Brian: $1";   tput sgr0
    tput bold;  echo -n "$user: "; tput sgr0
    read ans
    case "$ans" in
        [yY] | [yY][Ee][Ss] )
            tput setaf 2;  echo "Mr. Brian will now take you to $2"; tput sgr0
            $2 $3
        ;;
        [nN] | [nN][Oo] )
            tput setaf 4;  echo "Mr. Brian will NOT take you to $2"; tput sgr0
            
        ;;
        *)
            tput bold;  echo -n "Mr. Brian: ";    tput sgr0
            tput setaf 1;  echo "Please follow instructions. I will give you another chance to try again."; tput sgr0
            askYesNoQuestion "$1" $2
    esac
}

readConfig () {
    set -a
    source .env
    set +a
}

main() {
    setUpDir=$(pwd)
    echo "Hello there. Greetings from Mr. Brian"
    echo "Mr. Brian will now install the system for you and set up an admin user for you."
    echo "This will be very interactive. So please stay around"
    
    tput bold;  echo "Mr. Brian: I am now setting up system defaults for you with your root user."; tput sgr0
    tput bold;  echo "Mr. Brian: I am cloning into /var/www/html."; tput sgr0
    
    mkdir -p /var/www/html
    cd /var/www/html
    git clone https://github.com/csymapp/csycms.git csycms_v1
    cd csycms_v1
    
    tput bold;  echo "Mr. Brian: I am checking for updates."; tput sgr0
    git pull origin master
    
    tput bold;  echo "Mr. Brian: I am installing node modules."; tput sgr0
    npm install
    
    tput bold;  echo "Mr. Brian: I am copying service files."; tput sgr0
    cd Install
    cp -r lib/ /
    cd ..
    
    
    
    # tput bold;  echo "Mr. Brian: I am copying content files."; tput sgr0
    # cp -r content.example content
    
    
    tput bold;  echo "Mr. Brian: I am copying env files."; tput sgr0
    cp .env.example .env
    askYesNoQuestion "Would you like to edit .env file now? Y(es)/N(o)? Please answer Yes if this is the first time you are doing this setup." "configureEnv?"
    
    tput bold;  echo "Mr. Brian: I am Setting Up SSH Keys for bitbucket/github. Please save the private key as ~/.ssh/id_git"; tput sgr0
    
    cat ~/.ssh/id_git.pub || {
        ssh-keygen
        eval `ssh-agent`
        ssh-add ~/.ssh/id_git
        echo "Mr. Brian: Put the key below into your github/bitbucket site repo before continuing with the installation"; tput sgr0
        cat ~/.ssh/id_git.pub

        askYesNoQuestion "Have you finished setting up the ssh keys? y/n" pass
    }

    #default themes
    # tput bold;  echo "Mr. Brian: I am Setting Up default themes for you"; tput sgr0
    # sudo cp -r themes.bac themes

    readConfig

    # Docs content
    # tput bold;  echo "Mr. Brian: I am Setting Up docs for you"; tput sgr0
    # sudo mkdir -p content
    # cd content
    # sudo git clone $SITEREPO .
    # cd ..
    
    # # Docs content
    # tput bold;  echo "Mr. Brian: I am Setting Up docs for you"; tput sgr0
    # sudo mkdir -p content/csycmsdocs
    # cd content/csycmsdocs
    # sudo git clone $CSYCMSDOCSREPO .
    # cd ../..

    # # Public
    # tput bold;  echo "Mr. Brian: I am Setting Public folders for you"; tput sgr0
    # sudo cp -r content/csycmsdocs/public ./



    # # 
    # tput bold;  echo "Mr. Brian: I am copying config files."; tput sgr0
    # cd config
    # cp system.config.example system.config.js
    # askYesNoQuestion "Would you like to edit system config now? y/n" editFile? "system.config.js"
    # cd ..
    
    tput bold;  echo "Mr. Brian: I am now going through configuration files."; tput sgr0
    tput bold;  echo "Mr. Brian: I am now trying to start the service."; tput sgr0
    sudo systemctl daemon-reload
    sudo systemctl enable csycms_v1.service
    sudo systemctl start csycms_v1.service
    sudo systemctl restart csycms_v1.service
    sudo systemctl status csycms_v1.service
    
}

main


