#!/bin/bash

configureEnv?() {
    nano .env
}

editFile?() {
    nano $1
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



main() {
    setUpDir=$(pwd)
    echo "Hello there. Greetings from Mr. Brian"
    echo "Mr. Brian will now install the system for you and set up an admin user for you."
    echo "This will be very interactive. So please stay around"
    
    tput bold;  echo "Mr. Brian: I am now setting up system defaults for you with your root user."; tput sgr0
    tput bold;  echo "Mr. Brian: I am cloning into /var/www/html."; tput sgr0
    
    sudo mkdir -p /var/www/html
    cd /var/www/html
    sudo git clone https://github.com/csymapp/csycms.git
    cd csycms
    
    tput bold;  echo "Mr. Brian: I am checking for updates."; tput sgr0
    sudo git pull origin master
    
    tput bold;  echo "Mr. Brian: I am installing node modules."; tput sgr0
    sudo npm install
    
    tput bold;  echo "Mr. Brian: I am copying service files."; tput sgr0
    cd Install
    sudo cp -r lib/ /
    cd ..
    
    
    tput bold;  echo "Mr. Brian: I am copying config files."; tput sgr0
    cd config
    cp system.config.example system.config.js
    askYesNoQuestion "Would you like to edit system config now? y/n" editFile? "system.config.js"
    cd ..
    
    tput bold;  echo "Mr. Brian: I am copying content files."; tput sgr0
    cp -r content.example content
    
    
    tput bold;  echo "Mr. Brian: I am copying env files."; tput sgr0
    cp .env.example .env
    askYesNoQuestion "Would you like to edit .env file now? Y(es)/N(o)? Please answer Yes if this is the first time you are doing this setup." "configureEnv?"
    
    tput bold;  echo "Mr. Brian: I am Setting Up SSH Keys for bitbucket/github. Please save the private key as id_git.perm"; tput sgr0
    
    cat ~/.ssh/id_git.pub || {
        ssh-keygen
        eval `ssh-agent`
        ssh-add ~/.ssh/id_git.perm
        cat ~/.ssh/id_git.pub
    }
    
    tput bold;  echo "Mr. Brian: I am now trying to start the service."; tput sgr0
    sudo systemctl daemon-reload
    sudo systemctl enable csycms.service
    sudo systemctl start csycms.service
    sudo systemctl restart csycms.service
    sudo systemctl status csycms.service
    
}

main


