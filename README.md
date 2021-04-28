# CSYCMS - CSYBER SYSTEMS CMS

<img src="./markups/info.svg">

This repo has been deprecated and split into two different projects:
1. [csycms-cli](https://github.com/csymapp/csycms-cli)
2. [csycms-core](https://github.com/csymapp/csycms-core)

CSYCMS is a **Fast**, **Simple**, and **Flexible**, file-based content management system, knowledge base and static site generator for nodejs. It uses static Markdown files to serve the content which are pulled from public/private repos in github, bitcket, gitlab or any other git repository management service. It runs services that enables it to auto update itself and the content it serves. It follows similar principles to other flat-file CMS platforms, and allows you to use the structure of content files used in the [most popular flat file cms](https://getgrav.org) but in nodejs. In addition to this, it allows you to host several sites in one instance (installation) of it, and allows you to search across as many of your sites as you please. See more [features](#features).

Visit [http://learn.csycms.csymapp.com](http://learn.csycms.csymapp.com) to see a demo and get started!

The underlying architecture of CSYCMS is designed to use well-established and _best-in-class_ technologies. Some of these key technologies include:

* [Markdown](http://en.wikipedia.org/wiki/Markdown): for easy content creation
* [Hogan Templating](http://twitter.github.io/hogan.js/): for powerful control of the user interface
* Microservices to make deployments of multiple sites more stable

If you decide to go further with csycms, then please also learn how to pronouce it well. In declaring and defining the word, we intended that it should be pronouced as would `psy CMS` if that `psy` was  from words such as `psychology` etc.

# Table of Contents
- [Requirements](#requirements)
- [QuickStart](#quickstart)
 - [From GitHub](#from-github)
- [Features](#features)
 - [Common Features](#common-features)
 - [Unique Features](#unique-features)
 - [Other Advantages](#other-advantages)
- [Configuration](#configuration)
- [Updating](#updating)
- [Contributing](#contributing)
- [Security issues](#security-issues)
- [License](#license)
- [Todo](#todo)

# Requirements

## Server

You will need a server to install and test or use csycms. Although you can use your local computer as this server, you will need a server hosted somewhere else for production. You can check out the cheap [upcloud servers with a month of free trial](https://upcloud.com/signup/?promo=6D7UU8) or any other that you know.

## Domain Name

Although this is optional, it is good if have a domain name of your own so you can use it instead of the IP of your server.

## Nodejs

You will need to install nodejs in your server. If you experience any problems with this, you can see [how to install nodejs](https://joshtronic.com/2018/05/07/how-to-install-the-latest-version-of-nodejs-8-on-ubuntu-1804-lts/).

Supported Node Versions:
- v10.x.x
- v8.x.x

## Nginx

You will also need to install a web server in your server such as Nginx, Apache, etc. We recommend using Nginx.

## pKill/killall

This is for features which have been deprecated. And you are not going to use old code, are you? But if you decide to install it, then you may also have to [fix killall-command-not-found](https://bytefreaks.net/gnulinux/bash/bash-killall-command-not-found-a-solution)

## ssh

You will also need to setup ssh with all the keys for accessing repos (if you use any ssh remote, or if any of the repos of your sites is private). An [installation script](/Install/installCsycms.sh) is availed to help you with creating the keys. But if it fails to create the ssh keys for your git repo, you can [see how to create one](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html).

**[⬆ back home](#table-of-contents)**

# QuickStart

These are the options to get CSYCMS: (We see only one option for now. If you'd like to go any other way of installing, then you'll have to go it alone).

### From GitHub

We have created an [installation script](/Install/installCsycms.sh) which you can use to install CSYCMS. 

```
    cd /tmp
    wget https://raw.githubusercontent.com/csymapp/csycms/master/Install/installCsycms.sh
    chmod +x installCsycms.sh
    ./installCsycms.sh
```

Then follow the installation instructions as directed by the script.

You will have to edit [some configurations](#configuration)


**[⬆ back home](#table-of-contents)**

# Features

That csycms can compare with wordpress & co, we do not pretend. But it is flat file and they are not. And that csycms can compare with grav we do not pretend either. But it is nodejs and it is not. And with csycms you get extra features by which reasonable justification is found for its use and development.
## Common features
- Markdown for easy content creation

## Unique features
- Different themes for different files
- Several sites in a single installation (Like in shared hosting), making maintenance very easy.
- Search across multiple sites
- Auto-update of itself, the sites and the themes.
- Pulls sites content from github/gitlab/bitbucket, etc.
- Microservices (not in the scrictest sense of the word) to make deployments of multiple sites more stable

## Other advantages
- Very easy to learn.

# Configuration


You will need to do a bit of configuration before you can successfully use CSYCMS. You will need to edit the `.env` file and a `system.config.js` file for each site defined in `.env`. Each of these files have examples with the required parameters. You can check `.env.example` whose contents are copied to `.env` upon installation. And `system.config.example` which is copied for each new site registered.

## .env

`
    SITES="csycms|3000|https://github.com/csymapp/csycms-learn.git" # list of sites
`

`SITES` is a comma separated list of sites.

An entry for a single site has in order:
- site name
- port on which to server it
- the repo in which the site files are found

These parameters are separated by a `|`. To add another site, create for it its own configuration line. And add the line to `SITES=`, separating it from the last line by a comma.

`CSYCMSDOCSREPO=https://github.com/csymapp/csycms-learn.git # repo where csycms documentation is.`

You may not have to do anything to this.

`THEMESREPO=git@github.com:csymapp/csycms-themes.git # repo where csycms themes are`

Please leave also this as it is, unless you know what you are doing.

`UPDATEINTERVAL=5 # update interval in minutes`

The period for which you'd like the system to check for update for itself and for all the sites.

You can change these values while setting up the system for the first time or at any other time. Just remember to `systemctl restart csycms.service` every time you make any changes to `.env` except for the changes made during the installation.


## system.config.js

You will also need to make changes to all `system.config.js` in `config/*`. Please be sure especially to change 
 - `domain` (it is just a wrong naming which we will change later). By domain we mean the base url without the protocol. eg `www.cseco.co.ke`, `localhost:3001`, etc
 - `site`. This should be the same as the site name given in `.env`
 - `site_space`. This is used to defined sites whose content can be searched together.
 - `site_title`. 
 - `search_scope`. The value for this is either `local` or `global`. It defines where only the content for the current site is searched during a search performed on the site or the content for all the sites in the `search_space`.

For detailed documentation please refer to [csycms docs](http://learn.csycms.csymapp.com) or [csycms docs](https://github.com/csymapp/csycms-learn)

**[⬆ back home](#table-of-contents)**


**[⬆ back home](#table-of-contents)**

# Developing

Once you have followed the [quickStart guide](#quickstart), please also look at the detailed 

**[⬆ back home](#table-of-contents)**

# Contributing
We appreciate any contribution to CSYCMS, whether it is related to bugs, grammar, or simply a suggestion or improvement! Please refer to the [Contributing guide](CONTRIBUTE.md) for more guidance on this topic.

**[⬆ back home](#table-of-contents)**

## Security issues
If you discover a possible security issue related to CSYCMS, please send an email to brian@cseco.co.ke and cc surgbc@gmail.com and we'll address it as soon as possible.

**[⬆ back home](#table-of-contents)**

# License

See [LICENSE](LICENSE.txt)

**[⬆ back home](#table-of-contents)**

# Todo
- [ ] Authentication
- [x] Generating meta data
- [ ] Replace lunr with elasticlunr
- [ ] Highlighting search phrase in all results
- [ ] Nginx configuration

**[⬆ back home](#table-of-contents)**
