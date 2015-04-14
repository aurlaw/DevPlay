# Dev Play

Sample NodeJS & Go applications just for experimentation

Uses Vagrant with Ubuntu precise 64-bit VirtualBox 

Provisioned with Puppet for Nodejs, Go & Redis

Node JS applications contained under "app" directory

Go applications contained under "go" directory


## Prerequisites ##

* Vagrant
* VirtualBox


Launch Vagrant

```
$ vagrant up
```


## Node JS Sample Applications ##

SSH to vagrant box

```
$ vagrant ssh
```

Install components

```
$ npm install
```

###Redis Performance###


change directory to /vagrant/apps

run node redis-test to view commands

```
$ node redis-test
```

###Digital Ocean API###


change directory to /vagrant/apps

open config/digital_ocean.sample for configuration

run node do-test to view commands

```
$ node do-test
```

###System Usage Email###


change directory to /vagrant/apps

open config/usage.sample for configuration

run node usage-report to view commands

```
$ node usage-report
```


###Twitter/Express/Sockets.io###

Uses Socket.io 1.0 and Express 4

change directory to /vagrant/apps/twitter-express


Install components for Express, Twitter & Sockets.io

```
$ npm install
```



open config/config.sample for configuration

run node server to launch express on port 3500

```
$ node server
```

Open your browser and go to 
```
http://localhost:3500/
```


## Go Sample Applications ##

SSH to vagrant box

```
$ vagrant ssh
```


Install components

change directory to /vagrant/go

```
$ go get github.com/tools/godep
```



###Hello World###


change directory to /vagrant/go/src

run go run hello.go

```
$ go run hello/hello.go
```



##When completed##




```
$ vagrant halt
```
or
```
$ vagrant destroy
```






## Troubleshooting ##


#### Update NPM
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*, usually updating those tools to the latest version solves the issue.

Updating NPM:
```
$ npm update -g npm
```


#### Cleaning NPM cache
NPM has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

NPM Clean Cache:
```
$ npm cache clean
```


