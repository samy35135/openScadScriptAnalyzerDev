OpenScadScriptAnalyzer
===
OpenScadScripAnalyzer is an app runtime based on nodejs. You can download things(scad files) from [www.thingiverse.com](www.thingiverse.com) and parse them with OpenScadScriptAnalyzer. This project is published on the [Docker](https://www.docker.com/) also.

##How to install ?

### Dependencies

1 [Git](http://git-scm.com/)

2 [NodeJS](http://nodejs.org/) 

3 [Docker](https://www.docker.com/) 

4 [Npm](https://www.npmjs.org/) 

5 [Bower](http://bower.io/)

### Install project

1 Clone OpenScadScriptAnalyzer project

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