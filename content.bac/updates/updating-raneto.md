/*
Title: Updating CSYCMS
*/

The update process for CSYCMS is as follows:

* Make a backup of your `content` folder and your `config.js`. Copy these files somewhere else
* If you have edited the template you may also need to backup the `themes/default/` folder and anything you
have edited in the `public` folder
* Download the latest version of CSYCMS from the [releases page](https://github.com/gilbitron/CSYCMS/releases)
* Extract the CSYCMS zip/tar.gz and overwrite all of the files in your existing CSYCMS install, replacing
all files and folders
* Copy your `content` folder and `config.js` file from your backup location back into the install location
* If you have edited the template then copy your custom `themes/default/` and `public` files back as well
* Run `npm update` from the root of your install
* Restart node (`npm start`) and you should be running the new version of CSYCMS
