# Dev Play

Sample NodeJS applications

Uses Vagrant with Ubuntu precise 64-bit VirtualBox 

Provisioned with Puppet for Nodejs & Redis

Node JS applications contained under "app" directory



## Prerequisites ##

* Vagrant
* VirtualBox


Launch Vagrant

```
$ vagrant up
```


## Sample Applications ##

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

When completed

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
