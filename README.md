# CSYCMS - CSYBER SYSTEMS CMS

CSYCMS is a **Fast**, **Simple**, and **Flexible**, file-based content management system for nodejs. It uses static Markdown files to serve the content which are pulled from public/private repos in github. bitcket, gitlab or any other git repository management services. It runs services that enables it to auto update itself and the content it serves. It follows similar principles to other flat-file CMS platforms, and allows you to use the structure of content files used in the [most popular flat file cms](https://getgrav.org/downloads)
 but in nodejs. 

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

You may also have to fix [killall-command-no](https://bytefreaks.net/gnulinux/bash/bash-killall-command-not-found-a-solution)

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
- [ ] Generating meta data

**[⬆ back home](#table-of-contents)**