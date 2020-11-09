# Youtube Trending Videos Scrapper

This application will provides APIs to scrap youtube's trending video from (https://www.youtube.com/feed/trending) and save it to the database and also retrives the videos from the same database.

#### Following are the APIs endpoints on your localhost: 

1. http://localhost:3401/scrapper/v1/save/trending - To save the videos in the database and return scrapped content in response.

2. http://localhost:3401/scrapper/v1/fetch/trending/video - fetch the video list from the database

3. http://localhost:3401/scrapper/v1/fetch/trending/channel/video - fetch the video+channel list from the database

4. http://localhost:3401/scrapper/v1/fetch/trending/videoInfo/{videoId} - fetch the content based on videoId from the database.


## Requirements

For development, you will need Node.js, node package manager (npm), and mongo installed in your environement.

## Installation

 - $ git clone https://github.com/chetansingh/css-yt-scrapper.git

 - $ cd css-yt-scrapper

 - $ npm install

## Usage

After installation you need to run the following command inside you project root directory

$ node app.js

# Dockerization of this project (Linux)

## Prerequisites:
- nodejs, npm and docker should be installed on your machine 

## Docker
- To install Docker, follow the instructions mentioned in:

https://www.docker.com/products/container-runtime#/download

To check if Docker is installed and running, type below command in terminal:

$ docker --version

This will print the docker version in the terminal.

### Run the following command in the same project directory for building.

First install "docker-compose" if not installed by sudo apt install docker-compose 

$ docker-compose build

### Run below command to run your app inside a docker container

$ docker-compose up

- Open the below URL in brower to see your Node js application is running on port 3401

  http://localhost:3401