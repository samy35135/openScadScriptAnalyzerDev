OpenScadScriptAnalyzer
===
OpenScadScripAnalyzer is an app runtime based on nodejs. You can download things(scad files) from [www.thingiverse.com](www.thingiverse.com) and parse them with OpenScadScriptAnalyzer. This project is published on the [Docker](https://www.docker.com/) also.

##How to install ?

### Dependencies

* [Git](http://git-scm.com/)
* [NodeJS](http://nodejs.org/) 
* [Docker](https://www.docker.com/) 
* [Npm](https://www.npmjs.org/) 
* [Bower](http://bower.io/)

### Install project

Clone OpenScadScriptAnalyzer project

	$ git clone https://github.com/jiyoungParkKim/openScadScriptAnalyzer.git
	$ cd openScadScriptAnalyzer/
	$ sudo npm install
	$ bower install


Pull database from docker repository

	$ sudo docker pull jiyoungparkkim/mongodb_base:0.1


Start mongoDB database

	$ sudo docker kill $(sudo docker ps -a -q) && sudo docker rm $(sudo docker ps -a -q) && sudo docker run --name db -d jiyoungparkkim/mongodb_base:0.1


Get the ip adress of the mongoDB server

	$ for i in $(sudo docker ps -q); do ip=$(sudo docker inspect --format="{{ .NetworkSettings.IPAddress }}"" $i) done ;


Edit [openScadScriptAnalyzer/server/config/environment/developement.js]

	Change url to : mongodb://$ip/openscadanalyzer-dev


Start server

	$ sudo npm start

