import "./rightbar.css";
import Online from "../online/Online";

import { Edit } from "@mui/icons-material";
import { io } from "socket.io-client"; //notifications

import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

//user_id is forwarded only on home site
//user object is forwarded on profile site
export default function Rightbar({ page_type, user, user_id }) {
  const HomeRightbar = ({ identifier }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
      if (identifier) {
        const getOnlineFriends = async () => {
          try {
            const friendOnlineList = await axios.get(
              "/users/friends_online/" + identifier
            ); //friends_online
            setOnlineFriends(friendOnlineList.data);
          } catch (err) {
            console.log(err);
          }
        };
        getOnlineFriends();
      }
    }, []);

    return (
      <>
        {/* <div className="birthdayContainer">
          <img src={`${PF}gift.png`} alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have birthday today.
          </span>
        </div> */}
        <img src={PF + "ad.png"} alt="" className="rightbarAd" />{" "}
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {onlineFriends.map((u) => (
            <Online key={u._id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = ({ object }) => {
    const [friends, setFriends] = useState([]);
    const [informationEditMode, setInformationEditMode] = useState(false);

    //na profilowym wię wyświetlają znajomi użytkownicy (tutaj jest dostępny obiekt user)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(false);

    const [cityText, setCityText] = useState(object.currentLocation);
    const [fromText, setFromText] = useState(object.homeLocation);
    const [relationshipText, setRelationshipText] = useState(
      object.relationshipStatus
    );

    //follow notification
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      setSocket(io("ws://localhost:8900"));
    }, []);

    useEffect(() => {
      socket?.emit("addUser", user._id);
    }, [socket, user._id]);

    const handleNotification = (type) => {
      if (socket) {
        socket.emit("sendNotification", {
          senderName: currentUser.username,
          //receiverName: user.username,
          receiverId: object._id,
          type,
          link: `/profile/${currentUser.username}`,
        });
      }
    };

    useEffect(() => {
      if (currentUser.followings && object) {
        setFollowed(currentUser.followings.includes(object?._id));
      }
    }, [currentUser, object]);

    const handleClick = async () => {
      try {
        if (followed) {
          await axios.put("/users/" + object._id + "/unfollow", {
            userId: currentUser._id,
          });
          dispatch({ type: "UNFOLLOW", payload: object._id });
        } else {
          await axios.put("/users/" + object._id + "/follow", {
            userId: currentUser._id,
          });
          dispatch({ type: "FOLLOW", payload: object._id });
          handleNotification(3);
        }
      } catch (err) {
        console.log(err);
      }
      setFollowed(!followed);
    };

    useEffect(() => {
      if (object && object._id) {
        const getFriends = async () => {
          try {
            const friendList = await axios.get("/users/friends/" + object._id);
            setFriends(friendList.data);
          } catch (err) {
            console.log(err);
          }
        };
        getFriends();
      }
    }, [object]);

    const handleInformationEditModeChange = async () => {
      if (informationEditMode === false) {
        document.getElementById("currentLocationText").style.display = "none";
        document.getElementById("homeLocationText").style.display = "none";
        document.getElementById("relationshipText").style.display = "none";

        document.getElementById("currentLocationEdit").style.visibility =
          "visible";
        document.getElementById("homeLocationEdit").style.visibility =
          "visible";
        document.getElementById("relationshipEdit").style.visibility =
          "visible";
        setInformationEditMode(!informationEditMode);
      } else {
        document.getElementById("currentLocationText").style.display = "inline";
        document.getElementById("homeLocationText").style.display = "inline";
        document.getElementById("relationshipText").style.display = "inline";

        document.getElementById("currentLocationEdit").style.visibility =
          "hidden";
        document.getElementById("homeLocationEdit").style.visibility = "hidden";
        document.getElementById("relationshipEdit").style.visibility = "hidden";

        setInformationEditMode(!informationEditMode);

        //update the information to database

        const putResponse = await axios.put(`/users/${object._id}`, {
          currentLocation: cityText,
          homeLocation: fromText,
          relationshipStatus: relationshipText,
          userId: currentUser._id,
        });

        window.location.reload();
      }
    };

    return (
      <>
        {object.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <div className="ProfileInfoTitle">
          <h4 className="rightbarTitle">User information</h4>
          {object._id === currentUser._id && (
            <Edit
              className="editProfileInfo"
              onClick={handleInformationEditModeChange}
            />
          )}
        </div>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue" id="currentLocationText">
              {object.currentLocation}
            </span>
            <input
              type="text"
              placeholder=""
              value={cityText}
              onChange={(e) => setCityText(e.target.value)}
              className="editInput"
              id="currentLocationEdit"
            ></input>
          </div>

          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue" id="homeLocationText">
              {object.homeLocation}
            </span>

            <input
              type="text"
              placeholder=""
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              className="editInput"
              id="homeLocationEdit"
            ></input>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue" id="relationshipText">
              {object.relationshipStatus === 1
                ? "Single"
                : object.relationshipStatus === 2
                ? "Married"
                : "-"}
            </span>

            <select
              name="relationship"
              id="relationshipEdit"
              className="editInput"
              value={relationshipText}
              onChange={(e) => setRelationshipText(e.target.value)}
            >
              <option value="1" className="selectElement">
                Single
              </option>
              <option value="2" className="selectElement">
                Married
              </option>
              <option value="3" className="selectElement">
                -
              </option>
            </select>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {page_type === "profile" ? (
          <ProfileRightbar object={user} />
        ) : (
          <HomeRightbar identifier={user_id} />
        )}
      </div>
    </div>
  );
}
