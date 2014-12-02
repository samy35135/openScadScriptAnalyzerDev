OpenScadScriptAnalyzer
===
OpenScadScripAnalyzer is an app runtime based on nodejs. You can download things(scad files) from [www.thingiverse.com](www.thingiverse.com) and parse them with OpenScadScriptAnalyzer. This project is published on the [Docker](https://www.docker.com/) also.

##How to install ?

### Install Dependencies

* [Git](http://git-scm.com/) 
* [NodeJS](http://nodejs.org/) 
* [Docker](https://www.docker.com/) if you want to use Docker instead.
* [Npm](https://www.npmjs.org/) 
* [Bower](http://bower.io/)

### Install application

#### Using Git
Clone OpenScadScriptAnalyzer project and install it.

	$ git clone https://github.com/jiyoungParkKim/openScadScriptAnalyzer.git
	$ cd openScadScriptAnalyzer/
	$ sudo npm install
	$ bower install

#### Database
The project uses a mongo database to store the parsed things.
You can use [MongoDB](http://www.mongodb.org/) to host your database.
The database config file is in :

	server/config/environment/development.js

You may use our pre-filled database with this uri `148.60.11.195:27017`

#### Using Docker
You can use Docker to simply run the application.

Install [Docker](https://www.docker.com/)

Pull the project and start the container

	$ sudo docker pull jiyoungparkkim/openscadscript-analyzer:0.1
	$ sudo docker run --name web -d -p 9000:9000 --link db:db jiyoungparkkim/openscadscript-analyzer:0.1
#####If you have already mongo installed, you may have to stop it.

Pull the database and start the container

	$ sudo docker pull jiyoungparkkim/mongodb_base:0.1
	$ sudo docker run -d -p 27017:27017 --name mongodb jiyoungparkkim/mongodb_base:0.1 mongod

### Start the application

Move to the project folder and run

	$ sudo npm start

