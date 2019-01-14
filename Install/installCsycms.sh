#!/bin/bash

mkdir -p /var/www/html
cd /var/www/html
git clone https://github.com/csymapp/csycms.git
cd csycms
npm install
cd Install
sudo cp -r lib/ /
cd ..
cd config
cp system.config.example system.config.js
cd ..
cp -r content.example content
cp .env.example .env
sudo systemctl daemon-reload
sudo systemctl enable csycms.service
sudo systemctl start csycms.service
sudo systemctl restart csycms.service
sudo systemctl status csycms.service