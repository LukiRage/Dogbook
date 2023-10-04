import HelpAccordion from "../../components/helpAccordion/HelpAccordion";
import "./helpPage.css";
import { ArrowBack } from "@mui/icons-material";

export default function HelpPage() {
  const sections = [
    {
      title: "User registration",
      content:
        "To use create posts, message friends, make new connections using Dogbook platform you have to create user using user registration form. To proceed registration you have to fill the form with correct data such as the username should consist only of letters and numbers, email should be in form of exampla@domain.com (or other country related extension), the password should be more that 6 characters long (the longer the better) and should consist of letters, uppercase letters, numbers and characters.",
      steps: (
        <>
          <h4>To persist with user registration follow these steps:</h4>
          <ol>
            <li> Go to dogbook.com/.</li>
            <li>
              Fill the username with valid username text (should consist of
              letters and numbers).
            </li>
            <li>
              Fill the email with valid username (sholud consist of
              letters/numbers/characters and in form of example@domain.com).
            </li>
            <li>
              Fill the password with at least 6-characters long password which
              consist of letters, uppercase letters, numbers and characters.
            </li>
            <li>
              Re-enter the password (wholud be the same as the first password).
            </li>
            <li>
              Click on "Sign up" submit button to register (if the registration
              is correct the site will change to the login page, if not the form
              data is incorrect).
            </li>
          </ol>
        </>
      ),
    },

    {
      title: "Dog registration",
      content:
        "To track dog diseases, dog meals, activities, and baheviour as well to creating guest caretaker you have to create dog profile for your user account. The dog registration is simple and involve filling registration form with informations as dog name, age, weight, gender and breed after which user is send to the newly created dog profile where further customizations can be set (the dog photo and cover photo can be set).",
      steps: (
        <>
          <h4>How to register new dog:</h4>
          <ol>
            <li>
              Logged in users can add new dog on the left side of the screen
              under the "Add new" dog option
            </li>
            <li>
              He is redirected to a separate page where he must provide the
              dog's name, age, weight, gender and breed
            </li>
            <li>Then presses the register button and the dog is registered.</li>
            <li>
              The user is redirected to the page with the dog and the dog is
              added to the side panel.
            </li>
            <li>
              To add a photo of your dog and a background to its profile, click
              on the camera icon located there. Then select the photo you want
              to post.
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Guest registration",
      content:
        "When you want to let somebody take care of your dog while you are not around you could use Dogbook dog profile to provide dog information for that caretaker. For that the guest account that is linked to the dog profile is the best option. The guest can see the dog data and based on that provide the best care for your dog. Guest account cannot won't have the option to check your account and add new data to the dog profile - so your account will be safe all the time. The guest registration is longer than user registration for safety and consist od three steps: sending guest registration form to guest email, filling form by guest, setting guest accounf for specified dog (there can be set up multiple dog profiles for one guest.",
      steps: (
        <>
          <h4>To register guest:</h4>

          <span>On the user side</span>
          <ol>
            <li>
              To register a guest, a logged in user must select the register new
              guest option located at the top of the page in the topbar, next to
              the chat icon.
            </li>
            <li>
              Logged in user must enter the guest's email address and press the
              send invitation button.
            </li>
          </ol>

          <span>On the guest side</span>
          <ol>
            <li>The guest receives an e-mail with a link to register.</li>
            <li>
              After clicking on the link, you are redirected to the guest
              registration page.
            </li>
            <li>
              The website requires the username and password chosen by the
              guest. The email address is filled in automatically based on the
              email address to which the link was sent.
            </li>
            <li>Then press the register button</li>
            <li>
              Now the guest is registered but cannot log in yet, he must wait
              until the logged in user assigns him to a specific dog, then he
              will be able to log in.
            </li>
          </ol>

          <span>On the user side</span>
          <ol>
            <li>
              The user assigns a given guest to a specific dog in the same panel
              as registering a new guest.
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Add friends",
      content:
        "To take full advantage of Dogbook platform you may consider adding new friends, because the user feed is based on the friends activity - all the posts that are displayed to the user are the friend posts or current user posts. Having friends you can comment their posts, like them and send messages using Dogbook's messaging functionality.",
      steps: (
        <>
          <h4>To add new friends follow these steps:</h4>
          <ol>
            <li>
              {" "}
              To add a friend, a logged in user must search for his name in the
              search field located at the top of the middle part of the screen.
            </li>
            <li>After finding the selected person, click on him.</li>
            <li>
              Clicking takes us to the profile page of the selected person
            </li>
            <li>
              On the right side there is a blue button with the word "follow".
              After clicking on it, the person will be added to your friends
            </li>

            <ul>
              <li>
                If the button says "unfollow" instead of "follow", it means that
                the selected person is already your friend.
              </li>
            </ul>
            <li>
              Once added as a friend, the selected person should appear on the
              left side under the navigation buttons along with your other
              friends.
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Write your first message",
      content:
        "Messaging functionality in Dogbook is real time. All messages that are sent to the users are send as fast as you click sand button. The messaging history is permanent, so you can access it every time when uoy are logged in in your user account. Furtermore the messages that are sent to user have the real time notification built in, so if the user thom you are messaging is online it will that you send them message",
      steps: (
        <>
          <h4>To write your 1st message:</h4>
          <ol>
            <li>
              To write a message, the user must be logged in and have friends
              (if you do not know how to add friends, see the "Add friends" help
              point).
            </li>
            <li>
              When 1 condition has been met, click the chat icon located on the
              top right of the screen.
            </li>
            <li>
              Clicking on the chat icon will take you to the page where you will
              be able to write your first message.
            </li>
            <li>
              To write a message, you must first create a conversation with your
              friend. To do this, you must enter your friend's name in the
              search field located on the left side of the screen.
            </li>
            <li>
              After searching for a friend, just click on him and you can start
              communicating.
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Creating new event",
      content:
        "To create new events for all Dogbook community you have to be registered and logged-in user. The events are created by users, after creating the new event the event data will not be edited and will persist on Event page till completion. The events have name, description and cover photo. The data that controls the event visibility is the event-end time (after it completion the event will be purged from the event page and all the data will be lost). The event also have the interested user list - interested users can add themselves only once per event.",
      steps: (
        <>
          <h4>To create new event:</h4>
          <ol>
            <li> Go to dogbook.com/event after logging into service.</li>
            <li>Scroll to the end of the page.</li>
            <li>Add cover photo using white "plus" sign.</li>
            <li>
              Fill the "Event name" text field. (don't use the special
              characters)
            </li>
            <li>
              Add the event description. (you can use as many characters as you
              like, but try to be specific).
            </li>
            <li>
              Specify the event start time in date input, and then date time.
            </li>
            <li>
              Specify the event end time in date input, and then date time.
            </li>
            <li>
              Click "Add new event" button to save the new event (if the page
              reloads all is done, if the page stays still you made the error in
              field and the data cannot be submitted)
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Sending notifications",
      content: `Every logged-in user have the possibility to receive real-time notifications from the service. The notifications will be visible in notification centre at the topbar of the page after clicking the "bell" icon. The notifications are send in the following situations: comment/like od the owned post, following by other user, message from other user. The notifications are instant and they are not saved between user sessions (so you would not be bombarded by the list of unread notifications). All the notifications will be sent without notification sender noticing it (they work in background).`,
      steps: (
        <>
          <h4>To send notification to the post owner:</h4>
          <ol>
            <li> Like or comment the user post.</li>
            <li>
              If the post owner is logged in the notification with the post link
              will be sent to this user.
            </li>
          </ol>
        </>
      ),
    },
    {
      title: "Dog's log",
      content:
        "The dog logging functionality on the dog profile is very powerfull option for dog owners. They are accessible through the dog profile and as a dog owner you can log the thing such as dog past diseases, meals, activity. User can create the elements with corresponding data about selected topic, edit existing and delete records.",
      steps: (
        <>
          <h4>To add new dog's log:</h4>
          <ol>
            <li>
              To add an item to the dog's log, a logged-in user must first
              register the dog and then go to its profile by clicking on its
              name located on the left side of the screen under the friends
              panel.
            </li>
            <li>
              Select the category you want to add the item to. There are 4
              categories to choose from: diseases, meals, activities and
              behavior, the last one allows the user to freely describe his
              observations about changes in the dog's behavior.
            </li>
            <li>
              After selecting a category, in the lower right corner of the table
              there will be a button "Add new element...", after pressing it,
              fields will appear that need to be completed or from which the
              appropriate value should be selected.
            </li>
            <li>Then, to add an element, just click "save".</li>
          </ol>
        </>
      ),
    },
  ];

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="help">
        <div className="helpWrapper">
          <div className="pageInfo">
            <button className="homeButton" onClick={handleHome}>
              <ArrowBack fontSize="large" />
              <span className="homeButtonText">Go to home page</span>
            </button>
            <h1 className="pageInfoTitle">Help page</h1>
            <span className="pageInfoDescripton">
              This page is created to resolve any confusion assciated with using
              Dogbook service. If you have any problem with following topics
              feel free to click on the corresponding topic to see topic details
              with the helpful info about how service works and how to copmplete
              the tasks.
            </span>
          </div>
          <HelpAccordion sections={sections} />
        </div>
      </div>
    </>
  );
}
