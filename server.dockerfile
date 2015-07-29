FROM google/nodejs
MAINTAINER Sean Moon <sean.moon@devtechnology.com>

COPY package.json /opt/esigninApi/
COPY app /opt/esigninApi/app/
COPY config /opt/esigninApi/config/
COPY server.js /opt/esigninApi/

WORKDIR /opt/esigninApi
RUN npm -g update npm
RUN npm install
RUN npm install -g forever

EXPOSE 8443

CMD forever /opt/esigninApi/server.js