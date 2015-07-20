#!/usr/bin/bash --debug

if [ -z "$1" ]
  then
    echo "build mode is a required parameter. [server,mongo] "
  	exit
  elif [ "$1" == "server" ]
	then
	  tag="dtg/esignin-server"
	  port=8080
	  
	  if [ -s "$2" ]
	  	then
	    	envFile=$2
	  	else
	  		echo "An environment variable file is required."
	  	 	exit
	  fi
	  
	  #Execute the build
	  sudo docker run -p $port:$port --env-file=$envFile -d $tag
  elif [ "$1" == "mongo" ]
	then		
		tag="dtg/esignin-mongo"
		port=27017
		
		#Execute the build
	  	sudo docker run -p $port:$port -d $tag 
  else
  	echo "$1 is not a valid paramater, only server or mongo supported."
  	exit
fi
