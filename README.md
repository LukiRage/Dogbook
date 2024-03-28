![dobgbook_banner](https://github.com/RobertNeat/Dogbook/blob/main/screenshots/DogBook.png)

![node](https://img.shields.io/badge/Node-LTS-green)
![expressJS](https://img.shields.io/badge/ExpressJS-4.18.2-yellow)
![ReeactJS](https://img.shields.io/badge/ReactJS-18.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-lime)
![Socket IO](https://img.shields.io/badge/socket%20IO-ffffff)


# Dogbook

Dogbook is Facebook like social media for dog owners. It supports all the social interactions that are supported in modern social media platforms like: adding new events, messaging friends, pushing notifications and even friend management. Alongside all of that it implements dog owner exclusive functionality like: tracking informations about diseases/meals/activities/behaviour of the dog as the dog owner, adding temporary caretaker for dog (that have available dog panel to check dog informations and register new informations) or ewen checking information about meals that could dog benefit from or have negative consequences on its health (or information about diseases).

## Server side

Server side is created using Node and ExpressJS framework and offer REST API interface for fetching and manipulating data. It connects to instance of the Atlas MongoDB instance to store platform data. Server supports also uploading and fetching image data using packages like path (in version 0.12.7) and multer (in version 1.4.5-lts.1). Authentication of the guest account requires using email to access the final registration form (thanks to nodemailer package in version 6.9.5).

## Client side

Client side is created using Node and ReactJS framework that consumes REST API offering user GUI. Besides fetching data using reatc hooks it uses Context API to authenticate to server. The structure of this element has been divided besides pages and components (whom contain components used by pages). From user perspective there are used two packages that improves user experience - emoji_picker_react (that provides option to input emoji into post description field), and timeago (that formatts creation date of the posts into ".... ago" format that changes the metric from minutes to hours to days etc. based on the time passed. Client also supports sending and receiving the socket requests for sending messages to users and notification handling in the real time (without stating http session). 

## Socket

Socket side is implemented using socketio package (in version 4.7.2) for handling real time message sending as well as notification handling. Socket server opens session every time the client connects to the server minimalizing latency of the request and thanks to the small payload the messages are sent quickly.  

## Project running

To run project run following commands (Node platform required):

```
  npm install //<-- to install required dependencies defined in package.json (required in main foler/server folder/ client folder)
  npm start //<-- to start the project run in the main folder (there is script that runs server and client simontously)
```
All the commands that help namage the project are from NodeJS.
Other helpful commands:
```
  npm init -y //<--init the project structure with default configuration
  npm install <package_name> --save //<--install the package with specified name to the node_modules folder
```
