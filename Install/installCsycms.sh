#!/bin/bash

mkdir -p /var/www/html
cd /var/www/html
git clone https://github.com/csymapp/csycms.git
cd csymapp
npm install
cd Install
cp -r lib/ /
cd ..
cd config
cp system.config.example system.config.js
cd ..
cp -r content.example content
cp .env.example .env
systemctl daemon-reload
systemctl enable csycms.service
systemctl start csycms.service
systemctl restart csycms.service
systemctl status csycms.service