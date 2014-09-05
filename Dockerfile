FROM nodejs_base:0.1

ADD . /usr/src/app
WORKDIR /usr/src/app

# install your application's dependencies
RUN npm install
RUN bower install --allow-root

# replace this with your application's default port
EXPOSE 9000

# replace this with your main "server" script file
CMD [ "npm", "start" ]