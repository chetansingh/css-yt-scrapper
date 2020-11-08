# Youtube Trending Videos Scrapper

This application will provides APIs to scrap youtube's trending video from (https://www.youtube.com/feed/trending) and save it to the database and also retrives the videos from the same database.

#### Following are the APIs endpoints on your localhost: 

1. http://localhost:3401/scrapper/v1/save/trending - To save the videos in the database and return scrapped content in response.

2. http://localhost:3401/scrapper/v1/fetch/trending/video - fetch the video list from the database

3. http://localhost:3401/scrapper/v1/fetch/trending/channel/video - fetch the video+channel list from the database

4. http://localhost:3401/scrapper/v1/fetch/trending/videoInfo/{videoId} - fetch the content based on videoId from the database.


## Requirements

For development, you will only need Node.js and a node global package, npm, and mongo installed in your environement.

## Installation

 $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
 $ cd PROJECT_TITLE
 $ npm install

## Usage

After installation you need to run the following command inside you project root directory

$ node app.js

# Dockerization of this project

## Prerequisites:
- nodejs and npm:

## Docker
- To install Docker, follow the instructions mentioned in:

https://www.docker.com/products/container-runtime#/download

To check if Docker is installed and running, type below command in terminal:

$ docker --version

This will print the docker version in the terminal.

### Build Image of the NodeJS application from the project root directory

Run below command to create a Docker image of the node application:

$ docker build -t node-app .

## Run below command to run your app inside a docker container

$ docker run -p 8081:3401 -d node-app

- Open the below URL in brower to see your Node js application is running

  http://localhost:8081 




