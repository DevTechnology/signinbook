FROM centos:centos7
MAINTAINER Sean Moon <sean.moon@devtechnology.com>

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install mongodb-server; yum clean all
RUN mkdir -p /data/db

EXPOSE 27017

ENTRYPOINT ["/usr/bin/mongod","--sslMode","requireSSL","--sslPEMKeyFile","/certs/mongodb.pem","--dbpath","/data/db"]