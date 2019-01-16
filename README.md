# CSYCMS - CSYBER SYSTEMS CMS

CSYCMS is a **Fast**, **Simple**, and **Flexible**, file-based content management system,knowlwdge base and static site generator for nodejs. It uses static Markdown files to serve the content which are pulled from public/private repos in github. bitcket, gitlab or any other git repository management services. It runs services that enables it to auto update itself and the content it serves. It follows similar principles to other flat-file CMS platforms, and allows you to use the structure of content files used in the [most popular flat file cms](https://getgrav.org) but in nodejs. 

Visit [http://learn.csycms.csymapp.com](http://learn.csycms.csymapp.com) to see a demo and get started!

The underlying architecture of CSYCMS is designed to use well-established and _best-in-class_ technologies. Some of these key technologies include:

* [Markdown](http://en.wikipedia.org/wiki/Markdown): for easy content creation
* [Hogan Templating](http://twitter.github.io/hogan.js/): for powerful control of the user interface

# Table of Contents
- [Requirements](#requirements)
- [QuickStart](#quickstart)
 - [From GitHub](#from-github)
- [Configuration](#configuration)
- [Updating](#updating)
- [Contributing](#contributing)
- [Security issues](#security-issues)
- [License](#license)
- [Todo](#todo)

# Requirements

Supported Node Versions:
- v10.x.x
- v8.x.x

See [how to install nodejs](https://joshtronic.com/2018/05/07/how-to-install-the-latest-version-of-nodejs-8-on-ubuntu-1804-lts/).

You may also have to fix [killall-command-not-found](https://bytefreaks.net/gnulinux/bash/bash-killall-command-not-found-a-solution)

If the installation fails to create the ssh keys for your git repo, you can [see how to create one](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html).

**[⬆ back home](#table-of-contents)**

# QuickStart

These are the options to get CSYCMS:

### From GitHub

We have created an [installation script](/Install/installCsycms.sh) which you can use to install CSYCMS. 

```
    cd /tmp
    wget https://raw.githubusercontent.com/csymapp/csycms/master/Install/installCsycms.sh
    chmod +x installCsycms.sh
    ./installCsycms.sh
```

Then follow the installation instructions as directed by the script.

***OR***
If you want to run several instances of CSYCMS on the same server then you will need to install in a directory apart from the default installation directory. In this case try:

```
    cd /path/to/dir
    git clone https://github.com/csymapp/csycms.git .
    npm install
    mv Install/lib/systemd/system/csycms.service Install/lib/systemd/system/youservicename.service
    nano Install/lib/systemd/system/youservicename.service

    sudo cp -r Install/lib/ /
    cp config/system.config.example config/system.config.js
    nano config/system.config.js

    # cp -r content.example content
    cp .env.example .env
    nano .env
    # Please save the private key as ~/.ssh/id_git
    ssh-keygen
    eval `ssh-agent`
    ssh-add ~/.ssh/id_git
    cat ~/.ssh/id_git.pub
    # Put the key below into your github/bitbucket site repo before continuing with the installation

    sudo systemctl daemon-reload
    sudo systemctl enable youservicename.service
    sudo systemctl start youservicename.service
    sudo systemctl restart youservicename.service
    sudo systemctl status youservicename.service


```

**[⬆ back home](#table-of-contents)**


# Configuration

You will need to do a bit of configuration in `config/system.config.js` either during or after the installation. Please refer to the comments in this file.

You will also need to do a bit of configuration in `.env`.

*PORT* is the port in which CSYCMS will run.

*SITEREPO* is the repository where you site is. You will need to set ssh keys for accessing it if it is a private repo.

*CSYCMSDOCSREPO* is the repository where the csycms docs is hosted. You may not need to change this. CSYCMS docs will be added to you site under `csycms docs` directory.

For detailed documentation please refer to [csycms docs](http://learn.csycms.csymapp.com) or [csycms docs](https://github.com/csymapp/csycms-learn)

**[⬆ back home](#table-of-contents)**


# Updating

How frequently would you like CSYCMS to check for updates to itself to your site content? You can set this in `.env` by altering `UPDATEINTERVAL`. The value is in minutes.

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

**[⬆ back home](#table-of-contents)**