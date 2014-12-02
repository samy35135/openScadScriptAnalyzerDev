OpenScadScriptAnalyzer
===
OpenScadScripAnalyzer is an app runtime based on nodejs. You can download things(scad files) from [www.thingiverse.com](www.thingiverse.com) and parse them with OpenScadScriptAnalyzer. This project is published on the [Docker](https://www.docker.com/) also.

##How to install ?

### Dependencies

* [Git](http://git-scm.com/) 
* [NodeJS](http://nodejs.org/) 
* [Docker](https://www.docker.com/) if you want to use Docker instead
* [Npm](https://www.npmjs.org/) 
* [Bower](http://bower.io/)

### Install project

Clone OpenScadScriptAnalyzer project

	$ git clone https://github.com/jiyoungParkKim/openScadScriptAnalyzer.git
	$ cd openScadScriptAnalyzer/
	$ sudo npm install
	$ bower install

The application uses a mongo database. There's two ways of using a database

###With [Docker](https://www.docker.com/) 

Pull the database and start the container

	$ sudo docker pull jiyoungparkkim/mongodb_base:0.1
	$ sudo docker run -d -p 27017:27017 --name mongodb jiyoungparkkim/mongodb_base:0.1 mongod

	
#####If you have already mongo installed, you may have to stop it.


###With [Mongo](http://www.mongodb.org/) 

Download and install mongoDB

### Start the application

Move to the project folder and run

	$ sudo npm start

