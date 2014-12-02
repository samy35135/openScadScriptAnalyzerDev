OpenScadScriptAnalyzer
===
OpenScadScripAnalyzer is an app runtime based on nodejs. You can download things(scad files) from [www.thingiverse.com](www.thingiverse.com) and parse them with OpenScadScriptAnalyzer. This project is published on the [Docker](https://www.docker.com/) also.

##How to install ?

### Install Dependencies

* [Git](http://git-scm.com/) 
* [NodeJS](http://nodejs.org/) 
* [Npm](https://www.npmjs.org/) 
* [Bower](http://bower.io/)

### Install application

### Using Git
Clone OpenScadScriptAnalyzer project and install it.

	$ git clone https://github.com/jiyoungParkKim/openScadScriptAnalyzer.git
	$ cd openScadScriptAnalyzer/
	$ sudo npm install
	$ bower install

**Database**
The project uses a mongo database to store the parsed things.
You can use [MongoDB](http://www.mongodb.org/) to host your database.
The database config file is in :

	server/config/environment/development.js

You may use our pre-filled database with this uri :
	
	148.60.11.195:27017/openscadanalyzer-dev

Or a docker database : see Docker section.

To launch the application, move to the project folder and run :

	$ npm start

#### Using [Docker](https://docs.docker.com/)
You can use Docker to simply run the application.

Pull the project and start the container

	$ sudo docker pull jiyoungparkkim/openscadscript-analyzer:0.1
	$ sudo docker run --name web -d -p 9000:9000 --link db:db jiyoungparkkim/openscadscript-analyzer:0.1
#####If you have already mongo installed, you may have to stop it.

Pull the database and start the container

	$ sudo docker pull jiyoungparkkim/mongodb_base:0.1
	$ sudo docker run -d -p 27017:27017 --name mongodb jiyoungparkkim/mongodb_base:0.1 mongod

##How to use it?

OpenscadAnalyzer offers a web interface that allow you to parse things extracted from [www.thingiverse.com](www.thingiverse.com).
A thing has a .scad file that contains a program to print this 3D object with a 3D printer.

There are 4 tabs in the interface :

* **Home** : Show a chart showing the number of downloaded, parsed and failled things
* **Customizerble Things** : List things by tags ( default : customizer)
* **Download Things** : Allows yout to download more things. You need an access token to do this. Follow [this tutorial](http://www.thingiverse.com/developers/getting-started) to get one.
* **Parse Things** : Parse a number of Things to extract data such as number of variables, functions, the depth of the file...

##How it works?

### Architecture

### Project structure 


    openScadAnalyzer
     ├─ client             : client side - AngularJS
       ├─ app
         ├─ main           : main page (statistics)
         ├─ thingiverse    : main fonctions (batch jobs)
       ├─ components
         ├─ navbar         : menu
         ├─ socket         : socket.io client side conf
     ├─ server             : server side - Node.JS
       ├─ api
         ├─ thing          : main fonctions of server side
           ├─ model        : database models (mongoose(http://mongoosejs.com/) tech)
           ├─ openscadLib  : openscad libraries
       ├─ config           : server configurations
         ├─ environment    
           ├─ development.js : dev mode conf
           ├─ production.js  : production mode conf
         ├─ express.js     : express server conf
         ├─ socketio.js    : socket.io server side conf
       ├─ app.js           : main page ← entry point
       ├─ routes.js        : page routing conf 
      ├─ bower.json        : client side dependencies ( used by AngularJS)
      ├─ package.json      : server side dependencies ( used by Node.js)


	#SAMY#CESTPASSORCIER

### Angular

This project is made with ['angular-fullstack'](https://github.com/DaftMonk/generator-angular-fullstack) generator of [Yeoman](http://yeoman.io/)

### Access Token

To download things from thingiverse.com you need to have a access token from the developer site.
Follow  to get your access token.



## Client side

    ├─ app                      : application codes
      ├─ main
        ├─ main.controller.js   : controller
        ├─ main.html            :
        ├─ main.js              : uiRouting config of main module
      ├─ thingiverse           
        ├─ batch.html           : download things here
        ├─ parse.html           : parse things here
        ├─ thingiverse.batch.controller.js   : controller of batch.html
        ├─ thingiverse.controller.js         : controller of main.html
        ├─ thingiverse.foceParsing.controller.js : controller of parse.html
        ├─ thingiverse.html     : thing list
        ├─ tingiverse.js        : routing conf of thingiverse module
        ├─ tingiverse.service.js : service class of thingiverse.controller.js
      ├─ app.js                  : angular module configulation
    ├─ assets                    : public resources - images...
    ├─ components                : common components here
      ├─ navbar                  
        ├─ navbar.controller.js  : 
        ├─ navbar.html
      ├─ socket
        ├─ socket.service.js     : client socket conf

## Server side 

    ├─ api
      ├─ thing
        ├─ model
          ├─ Category.model.js
          ├─ Comment.model.js
          ├─ File.model.js
          ├─ Pagination.js
          ├─ Tag.model.js
          ├─ Thing.model.js
        ├─ Commandline.js         : Helper class for node execution in the Cli env
        ├─ DataBag.js             : Helper class for thingiverse.service.js
        ├─ index.js               : rounting conf
        ├─ openSadAnalyzer.js     : Helper class for parsing - parse scadfiles(using openscad-openjscad-translator module) 
                                   and make statistics data 
        ├─ parsingHelper.js       : Helper class for parsing - save the result of parsing in the db
        ├─ requestHelper.js       : Helper class for http request
        ├─ socketMsgHelper.js     : Helper class for socket.io
        ├─ thingiverse.controller.js  : web controller
        ├─ thingiverse.dao.js         : data access class
        ├─ thingiverse.service.js     : service 
        ├─ thigiveseUtils.js          : utils
