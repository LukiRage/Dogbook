import "./sidebar.css";
import {
  RssFeed,
  Chat,
  HelpOutline,
  Event,
  AddCircleOutline,
  Settings,
  Sick,
  Restaurant,
} from "@mui/icons-material";

import OwnedDog from "../ownedDog/OwnedDog";
import CloseFriend from "../closeFriend/CloseFriend";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; //"././context/AuthContext";
import { useContext } from "react";

export default function Sidebar() {
  const { user, role } = useContext(AuthContext);
  const UserSidebar = ({ user }) => {
    const [followings, setFollowings] = useState([]);
    const [ownedDogs, setOwnedDogs] = useState([]);

    //fetch usernames of all followings to display
    useEffect(() => {
      if (user && user.followings) {
        const getFollowings = async () => {
          try {
            const friendList = await axios.get("/users/friends/" + user._id);
            setFollowings(friendList.data);
          } catch (err) {
            console.log(err);
          }
        };
        getFollowings();
      }
    }, [user]);

    useEffect(() => {
      //console.log("user changed:", user);
      if (user._id && user) {
        const fetchOwnedDogs = async () => {
          try {
            const dogsResponse = await axios.get("/dog/byUser/" + user._id);
            //console.log("dogsResponse:", dogsResponse.data);
            setOwnedDogs(dogsResponse.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchOwnedDogs();
      }
    }, [user._id]);

    //console.log("Heeelllo:" + user.followings);

    const addDogLink = () => {
      window.location.href = "/dog_register";
    };

    //link handlers
    const handleFeed = () => {
      // Use the history object to navigate to the "/feed" page
      window.location.href = "/";
    };
    const handleChat = () => {
      // Use the history object to navigate to the "/feed" page
      window.location.href = "/messenger";
    };
    const handleEvent = () => {
      // Use the history object to navigate to the "/feed" page
      window.location.href = "/event";
    };

    const handleMealList = () => {
      window.location.href = "/mealInfoHub";
    };
    const handleDiseaseList = () => {
      window.location.href = "/diseaseInfoHub";
    };

    const handleHelp = () => {
      window.location.href = "/help";
    };
    const handleSettings = () => {
      window.location.href = "/settings";
    };
    return (
      <div className="sidebar">
        <div className="sidebarWrapper">
          <ul className="sidebarList">
            <li className="sidebarListItem" onClick={handleFeed}>
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </li>
            <li className="sidebarListItem" onClick={handleChat}>
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chat</span>
            </li>
            <li className="sidebarListItem" onClick={handleEvent}>
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Event</span>
            </li>

            <li className="sidebarListItem" onClick={handleMealList}>
              <Sick className="sidebarIcon" />
              <span className="sidebarListItemText">Meal list</span>
            </li>
            <li className="sidebarListItem" onClick={handleDiseaseList}>
              <Restaurant className="sidebarIcon" />
              <span className="sidebarListItemText">Disease list</span>
            </li>

            <li className="sidebarListItem" onClick={handleSettings}>
              <Settings className="sidebarIcon" />
              <span className="sidebarListItemText">Settings</span>
            </li>
            <li className="sidebarListItem" onClick={handleHelp}>
              <HelpOutline className="sidebarIcon" />
              <span className="sidebarListItemText">Help</span>
            </li>
          </ul>
          {/* <button className="sidebarButton">Show more</button> */}
          <hr className="sidebarHr" />
          <ul className="sidebarFriendList">
            {followings.map((following) => (
              <CloseFriend key={following._id} user={following} />
            ))}
          </ul>
          <hr className="sidebarHr" />

          <ul className="sidebarDogList">
            <div className="addButton" onClick={addDogLink}>
              <AddCircleOutline className="addIcon" fontSize="large" />
              <span className="addText">Add new dog ...</span>
            </div>
            {ownedDogs.map((dog) => (
              <OwnedDog key={dog._id} dog={dog} />
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const GuestSidebar = ({ guest }) => {
    //console.log("Heeelllo:" + user.followings);
    const [ownedDogs, setOwnedDogs] = useState([]);

    useEffect(() => {
      //console.log("user changed:", user);
      if (user._id && user) {
        const fetchOwnedDogs = async () => {
          try {
            const dogsResponse = await axios.get(
              "/guest/dogs_for_guest/" + user._id
            );
            //console.log("dogsResponse:", dogsResponse.data);
            setOwnedDogs(dogsResponse.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchOwnedDogs();
      }
    }, [user._id]);

    return (
      <div className="sidebar">
        <div className="sidebarWrapper">
          <div className="sidebarGuest">
            <ul className="sidebarDogList">
              {ownedDogs.map((dog) => (
                <OwnedDog key={dog._id} dog={dog} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {user && role === "LoginUser" ? (
        <UserSidebar user={user} />
      ) : (
        <GuestSidebar guest={user} />
      )}
    </div>
  );
}
