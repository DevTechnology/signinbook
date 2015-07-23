Dev Technology eSignin README File

# Signin

  User Signin Component for Dev Technology
  
## Requirements
  2 AWS EC2 instances to run node server & mongo db.
  
  1 AWS S3 instance to run client code & to save daily reports.
  
  Docker daemon should be running on EC2 instances.
  
## Pre-installation
  --- Node Server env variables:
  
    To protect sensitive information, all keys(aws and encryption related keys) are set as environment variables.
  
    Save all env variables(all aws keys and key pair for mongo db encryption) to a file and pass it when the run script is invoked.
  
    Follow Amazon AWS instruction for the S3 keys. 
    Encryption keys can be generated using the following command.
  
    	openssl rand -base64 32; openssl rand -base64 64;
    	
    Required Key/Values are EncryptionKey, SigningKey, and aws keys.
  
  --- Mongo Server PEM file:
  
    MongoDB is connected via HTTPS and pem file is required when the db server is started. 
    
    Put mongodb.pem file to /etc/certs/.

## Build/Installation
  The installation consists of 3 sub installations.
  
  1. server
  	Modify config/config.js.prod to replace 'prod_mongo_ip' with actual production mongo server ip address.
  	
  	sudo runtime/script/build_docker_image.sh server prod/dev
  	
  2. mongo
  	sudo runtime/script/build_docker_image.sh mongo 
  	
  3. client
    Modify public/js/config/config.js.prod to replace 'prod_api_server_ip' with actual production node.js server ip address.
    Then, copy config.js.prod to config.js
        
  	Follow instructions on http://www.nickdobie.com/blog/hosting-angularjs-with-amazon-s3/
  	
## Run
  1. server
  	sudo runtime/script/run_docker_image.sh server <env variable file path>
  	
  2. mongo
  	sudo runtime/script/run_docker_image.sh mongo
  	
## Todo

  * Currently, esignin uses one source location which means the app doesn't care where the user logs in from.  

## License 

(The MIT License)

Copyright (c) 2015 Dev Technology &lt;sean.moon@devtechnology.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.