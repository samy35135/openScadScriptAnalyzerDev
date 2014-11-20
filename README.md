OpenScadScriptAnalyzer
===
OpenScadScripAnalyzer is an app runtime based on nodejs. You can download things(scad files) from [www.thingiverse.com](www.thingiverse.com) and parse them with OpenScadScriptAnalyzer. This project is published on the [Docker](https://www.docker.com/) also.

##Ubuntu Installing

### Dependencies

1 [NodeJS](http://nodejs.org/) is an open source, cross-platform runtime environment for server-side and networking applications. Node.js applications are written in JavaScript

	$ sudo add-apt-repository ppa:chris-lea/node.js
	$ sudo apt-get update
	$ sudo apt-get install nodejs


2 [Docker](https://www.docker.com/) is an open-source project that automates the deployment of applications inside software containers, by providing an additional layer of abstraction and automation of operating system–level virtualization on Linux.

	$ sudo apt-get update
	$ sudo apt-get install docker.io


3 [Npm](https://www.npmjs.org/) is the default package manager for Node.js

	$ sudo apt-get install npm


4 [Bower](http://bower.io/) Bower is a package manager for Javascript libraries that allows you to define, version, and retrieve your dependencies.

	$ sudo npm -g install bower


### Install project

1 [Git](http://git-scm.com/)

	$ sudo apt-get install git
	$ git clone https://github.com/jiyoungParkKim/openScadScriptAnalyzer.git
	$ cd openScadScriptAnalyzer/
	$ sudo npm install
	$ bower install


2 Pull database from docker repository

	$ sudo docker pull jiyoungparkkim/mongodb_base:0.1


3 Start mongoDB database

	$ sudo docker kill $(sudo docker ps -a -q) && sudo docker rm $(sudo docker ps -a -q) && sudo docker run --name db -d jiyoungparkkim/mongodb_base:0.1

4 Get the ip adress of the mongoDB server

	$ for i in $(sudo docker ps -q); do ip=$(sudo docker inspect --format="{{ .NetworkSettings.IPAddress }}"" $i) done ;

5 Edit [openScadScriptAnalyzer/server/config/environment/developement.js]

	Change url to : mongodb://$ip/openscadanalyzer-dev

6 Start server

	$ sudo npm start