FROM google/nodejs
MAINTAINER Sean Moon <sean.moon@devtechnology.com>

WORKDIR /opt/esigninApi
ADD package.json /opt/esigninApi
ADD app /opt/esigninApi
ADD config /opt/esigninApi
RUN cp /opt/esigninApi/database.js.dev /opt/esigninApi/database.js
ADD server.js /opt/esigninApi

RUN cd /opt/esigninApi
RUN npm -g update npm
RUN npm install
RUN npm install -g forever

EXPOSE 8080

CMD forever /opt/esigninApi/server.js