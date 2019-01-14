---
title: Docker
metadata:
    description: Docker is a containerization platform that helps maintain consistent behavior across different development and production environments.
taxonomy:
    category: docs
---

>>> To contribute to this documentation, please submit a pull request to our [learn repository](https://github.com/userfrosting/learn/tree/master/pages).

The relevant files for installing UserFrosting with Docker are `docker-compose.yml`, and the contents of `docker/`.

First, install [Docker Compose](https://docs.docker.com/compose/install/).

Second, initialize a new UserFrosting project:

1. Copy `app/sprinkles.example.json` to `app/sprinkles.json`
2. Run `chmod 777 app/{logs,cache,sessions}` to fix file permissions for web server. (NOTE: File
   permissions should be properly secured in a production environment!)
2. Run `docker-compose run composer install` to install all composer modules.
3. Run `docker-compose run node npm install` to install all npm modules.

Now you can start up the entire Nginx + PHP + MySQL stack using docker with:

    $ docker-compose up

On the first run you need to init the database (your container name may be different depending on the name of your root directory):

    $ docker exec -it -u www-data userfrosting_php_1 bash -c 'php bakery migrate'
    
You also need to setup the first admin user (again, your container name may be different depending on the name of your root directory):

    $ docker exec -it -u www-data userfrosting_php_1 bash -c 'php bakery create-admin'

Now visit `http://localhost:8570/` to see your UserFrosting homepage!

**This is not (yet) meant for production!**

You may be tempted to run with this in production but this setup has not been security-hardened. For example:

- Database is exposed on port 8571 so you can access MySQL using your favorite client at localhost:8571. However,
  the way Docker exposes this actually bypasses common firewalls like `ufw` so this should not be exposed in production.
- Database credentials are hard-coded so obviously not secure.
- File permissions may be more open than necessary.
- It just hasn't been thoroughly tested in the capacity of being a production system.
