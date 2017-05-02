FROM node
MAINTAINER Scott Traver

RUN mkdir -p /usr/src
WORKDIR /usr/src
ADD . /usr/src

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
