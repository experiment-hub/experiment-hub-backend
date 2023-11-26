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
```

In `mongosh``
```
use admin
db.createUser(
  {
    user: "admin",
    pwd: passwordPrompt(),
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "readWriteAnyDatabase", db: "admin" },
      { role: "clusterAdmin", db: "admin" }
    ]
  }
)

use experiment_hub
db.createUser(
  {
    user: "experiment_hub",
    pwd: passwordPrompt(),
    roles: [
      { role: "dbOwner", db: "experiment_hub" },
      { role: "userAdmin", db: "experiment_hub" }
    ]
  }
)
```

Create keyfile for replica set
```bash
sudo openssl rand -base64 756 > /var/lib/mongodb/keyfile
sudo chmod 400 /var/lib/mongodb/keyfile

```

In `/etc/mongod.conf``
```yml
net:
  port: 27017
  bindIp: 0.0.0.0
security:
  authorization: enabled
  keyFile: /var/lib/mongodb/keyfile
replication:
  replSetName: experiment-hub-rs
```

Then restart mongodb service an login:
```
mongosh --authenticationDatabase "admin" -u "admin" admin -p

use admin
rs.initiate()

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
sudo ufw allow from any to any port 80 proto tcp
sudo ufw allow from 10.124.0.0/20 to any port 3000 proto tcp
sudo ufw allow from any to any port 3000 proto tcp
sudo ufw enable
reboot

#install postgres client
sudo apt install postgresql-client

#install mongo shell
sudo apt-get install gnupg
wget -qO- https://www.mongodb.org/static/pgp/server-7.0.asc | sudo tee /etc/apt/trusted.gpg.d/server-7.0.asc
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-mongosh
```
