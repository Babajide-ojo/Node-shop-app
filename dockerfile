# Use the predefined node base image for this module.
FROM node:14-alpine

# create the log directory
RUN mkdir -p /var/log/applications/node-app

# Creating base "www" directory where the source repo will reside in our container.
RUN mkdir -p /var/www/
WORKDIR /var/www/

COPY package*.json /var/www/

RUN npm install && npm cache clean

# Code is copied from the host machine to this "www" folder in the container as a last step.
COPY . /var/www/

# Map a volume for the log files and add a volume to override the code
VOLUME ["/var/www/", "/var/log/applications/node-app"]

# Expose web service and nodejs debug port
EXPOSE 8000

CMD [ "yarn", "watch:dev" ]
