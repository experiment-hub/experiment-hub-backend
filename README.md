<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# Infra documentation

## VM Postgres
```bash
#update repos and upgrade
apt update
apt upgrade

#basic admin
useradd -m -s /bin/bash experiment-hub
usermod -aG sudo experiment-hub
passwd experiment-hub #saved in secrets
##Add public keys under /home/experiment-hub/.ssh/authorized_keys

#configure firewall
sudo ufw status #shows inactive
sudo ufw allow ssh
sudo ufw allow from 10.124.0.0/20 to any port 5432
sudo ufw enable
reboot

#postgre install
sudo apt install postgresql postgresql-contrib

#change postgres password
sudo su - postgres
psql
  \password #saved in secrets
  create database experiment_hub;

#modify postgres.conf
sudo vim /etc/postgresql/14/main/postgresql.conf
listen_addresses = '*'          # what IP address(es) to listen on;

#modify pg_hba.conf
sudo vim /etc/postgresql/14/main/pg_hba.conf
host    experiment_hub  postgres        10.0.0.0/8              scram-sha-256
```

## VM Mongo
```bash
#update repos and upgrade
apt update
apt upgrade

#basic admin
useradd -m -s /bin/bash experiment-hub
usermod -aG sudo experiment-hub
passwd experiment-hub #saved in secrets
##Add public keys under /home/experiment-hub/.ssh/authorized_keys

#configure firewall
sudo ufw status #shows inactive
sudo ufw allow ssh
sudo ufw allow from 10.124.0.0/20 to any port 27017
sudo ufw enable
reboot

#install mongo
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-database hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-mongosh hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections
systemctl enable mongod.service
sudo systemctl start mongod
sudo systemctl status mongod

mongosh
use admin
db.createUser(
  {
    user: "admin",
    pwd: passwordPrompt(),
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "readWriteAnyDatabase", db: "admin" }
    ]
  }
)

#in /etc/mongod.conf
security:
    authorization: enabled

mongosh --authenticationDatabase "admin" -u "admin" admin -p

use experiment_hub

alias mongoshadmin='mongosh --authenticationDatabase "admin" -u "admin" admin -p'

```

## VM experiment-hub-backend
```bash
#create user with sudo
useradd -m -s /bin/bash experiment-hub
usermod -aG sudo experiment-hub
passwd experiment-hub #saved in secrets
##Add public keys under /home/experiment-hub/.ssh/authorized_keys
sudo apt update
sudo apt upgrade

#install docker
#Instalación de Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce
sudo systemctl status docker #check service status
sudo usermod -aG docker ${USER} 

#install docker compose
sudo apt install docker-compose

#activate firewall
sudo ufw status #shows inactive
sudo ufw allow ssh
sudo ufw allow from 10.124.0.0/20 to any port 3000 proto tcp
sudo ufw enable
reboot

#install postgres client
sudo apt install postgresql-client

```