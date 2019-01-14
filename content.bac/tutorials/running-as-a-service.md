/*
Title: Running as a Service
Sort: 2
*/

You can run CSYCMS easily in the background on your local or production machines with PM2.

1. Install CSYCMS globally with `npm install -g CSYCMS`
2. Edit the configuration file in your global NPM `node_modules/` directory (locate with `which CSYCMS` on *NIX)
3. Run CSYCMS with `CSYCMS start` and access logs with `CSYCMS logs`
4. When finished, run `CSYCMS stop`
