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

## Page screenshots gallery

For the purpose of looking up the client desing in the followinh section will be some of the screenshots with explanation:
1. Dog profile page - this page display dog profile alongside the basic information about the dog like age, weight, gender and breed (as well as breed disadvantage and advantages. The dog profile image as well as cover image are customizable. In the main section there is the dog main tracker (that can track diseases/meals/activity/behaviour in the one component).

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/1_dog_profile.png"  height="300"/>
  
2. Home feed - this page display the user home page with the friend post feed that user can interact with. The list of the posts can have interaction like/unlike using like or heart icon, as well as adding comment (or deleting own comment, or even editing own comment). The left bar displays the list of the locations that logged in user can be navigated to, as well as list of friends and under them list of owned dogs. Right sidebar displays the list of the logged in and active friends. On the topbar there are guest center, message center as well notifiation center.

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/2_home_feed.png"  height="300"/>
  
3. User profile -this page is the logged in user personal page that can be edited (user can set the profile image as well as the background page. As well the posts can be created in the user feed under user profile logo.

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/3_user_profile.png"  height="300"/>

4. Guest view - this page lets registered temporary caretaker to check data about dog as well add note about one of the four dog life elements (diseases/meals/activity/behaviour).

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/4_guest_view.png"  height="300"/>

5. Setting page - this page allow authenticated users to manage guest accounts lined to their dog profiles, or even delete dog profile after they passed away. In the danger section there is also option to delete user account if the wish to opt out from platform.

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/5_settings_page.png"  height="300"/>

6. Event page - allows authenticated users to create new activities/events for their dog community. Every user can show interest in specific event (or opt out from event). The created event have its cover image, event name, description, start and end date (after the end date the event is no longer valid so it's deleted from the database).

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/6_event_page.png"  height="300"/>

7. Messenger page - it's the special place for exchanging text messages alongside emojis between befriended users. On the left bar the currently logged in user can select conversation with friend (otr start new conversation). Every new message triggers the notification if the recipient is present (online).

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/7_messenger_page.png"  height="300"/>

8. Dog meals info - provides the list of the safe meal options alongside the nutrition information and how to prepare them. As well as dangerous meals that dog owners have to avoid giving it to their puppies.

<img src="https://github.com/RobertNeat/Dogbook/blob/main/screenshots/8_dog_meals_info.png"  height="300"/>

Rest of the more important images can be found in the "screenshots" folder or running the app. 


### The developers that work on this project:

- @RobertNeat
- @LukiRage
- @Kander678

