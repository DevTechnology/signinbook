#!/bin/bash

help() {
    echo "Usage: ";
    echo "";
    echo "$0 server [env]      or";
	echo "$0 mongo";
	echo "";
	echo "[env] : prod or dev";
	echo "";
	exit 1;
}

if [ $# -eq 0 ]; then
	help
fi

if [ -z "$1" ]
  then
    help
  elif [ "$1" == "server" ]
	then
		if [ -z "$2" ]
		  then
		    help
		  elif [ "$2" == "prod" ]
			then
			  cp config/config.js.prod config/config.js
		  elif [ "$2" == "dev" ]
			then
			  cp config/config.js.dev config/config.js
		  else
		    help
		fi
		
	  	tag="dtg/esignin-server"
	  	dockerfile=server.dockerfile
  elif [ "$1" == "mongo" ]
	then		
		tag="dtg/esignin-mongo"
		dockerfile=mongo.dockerfile
  else
  	help
fi

#Execute the build
sudo docker build -f $dockerfile --tag=$tag .