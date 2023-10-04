import "./topbar.css";
import {
  Search,
  Chat,
  Notifications,
  Logout,
  PersonPinCircleOutlined,
  Close,
  MarkAsUnreadOutlined,
} from "@mui/icons-material";

import axios from "axios";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import GuestManager from "../guestManager/GuestManager";
import { io } from "socket.io-client"; //notifications

export default function Topbar({ guest_mode }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [searchResult, setSearchResult] = useState([]);
  const history = useNavigate();

  //notification pop-up
  const [notificationPop, setNotificationPop] = useState(false);

  //guest pop-up
  const [guestPop, setGuestPop] = useState(false);

  //////////////////////////////////////////////////////////////////
  //notification receiving
  const [socket, setSocket] = useState(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setSocket(io("ws://localhost:8900"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user._id);
  }, [socket, user._id]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [...prev, data]);
      });
    }
  }, [socket]);

  const displayNotification = ({ senderName, type, link }) => {
    let action;

    const randomNumber = (Math.random() * Date.now()) % 1;

    if (type === 1) {
      action = "liked";
    } else if (type === 2) {
      action = "commented";
    } else if (type === 3) {
      action = "followed";
    } else {
      action = "messaged";
    }
    if (type === 1 || type === 2) {
      return (
        <a href={link} className="notificationLink">
          <span className="notification" key={randomNumber}>
            {`${senderName} ${action} your post.`}
          </span>
        </a>
      );
    } else {
      return (
        <a href={link} className="notificationLink">
          <span className="notification" key={randomNumber}>
            {`${senderName} ${action} you.`}
          </span>
        </a>
      );
    }
  };

  const handleRead = () => {
    setNotifications([]);
    setNotificationPop(false);
  };

  //////////////////////////////////////////////////////////////////
  const handleSearch = async () => {
    try {
      let searchUsername = document.getElementById("searchField").value;
      let userList = [];

      if (searchUsername.trim("") === "") {
        setSearchResult([]);
      } else {
        const responseData = await axios.get(`/users/all/${searchUsername}`);
        userList = responseData.data;
        setSearchResult(userList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    const user_Id = JSON.parse(localStorage.getItem("user"))._id;
    const logged_in_role = localStorage.getItem("role");
    try {
      if (logged_in_role === "LoginUser") {
        const res = await axios.post("/auth/logout", {
          _id: user_Id,
        });
      }
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    } catch (err) {
      console.log(err);
    }

    window.location.reload();
  };

  const handleChat = () => {
    history("/messenger");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Dogbook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        {!guest_mode && (
          <div className="searchbar">
            <Search className="searchIcon" /*onClick={handleSearch}*/ />
            <input
              placeholder="Search for friends ..."
              className="searchInput"
              id="searchField"
              onChange={handleSearch}
            />
          </div>
        )}

        {searchResult.length > 0 ? (
          <div className="searchResultBox">
            <ul className="resultList">
              {searchResult.map((result) => (
                <Link key={result._id} to={"/profile/" + result.username}>
                  {/* Dodać linka do profilu */}
                  <li className="resultElement">
                    <img
                      src={
                        result.profilePicture
                          ? PF + result.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                      alt=""
                      className="resultImg"
                    />
                    <span className="rightbarFollowingName">
                      {result.username}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="topbarRight">
        <div className="topbarLinks">
          {/* {!guest_mode && <span className="topbarLink">Homepage</span>}
          {!guest_mode && <span className="topbarLink">Timeline</span>} */}
        </div>

        {!guest_mode && (
          <div className="topbarIcons">
            <div
              className="topbarIconItem"
              onClick={() => setGuestPop(!guestPop)}
            >
              <PersonPinCircleOutlined />
            </div>

            {guestPop && (
              <div className="guestTray">
                <div>
                  {/* <h3 className="guestTitle">Guest management</h3>
                  <div className="guestEmptyDesc">
                    Register a guest who will take care of your pet while you
                    are away
                  </div> */}

                  <GuestManager />
                </div>
                <div className="closeBtn" onClick={() => setGuestPop(false)}>
                  <span className="closeText">Close</span>
                  <Close />
                </div>
              </div>
            )}

            <div className="topbarIconItem">
              <Chat onClick={handleChat} />
              {/* <span className="topbarIconBadge">1</span> */}
            </div>
            <div
              className="topbarIconItem"
              onClick={() => setNotificationPop(!notificationPop)}
            >
              <Notifications />
              {notifications.length > 0 && notifications.length <= 9 ? (
                <span className="topbarIconBadge">{notifications.length}</span>
              ) : (
                notifications.length > 0 && (
                  <span className="topbarIconBadge">9+</span>
                )
              )}
            </div>

            {notificationPop && (
              <div className="notificationTray">
                <div>
                  {notifications.map((n) => displayNotification(n))}

                  {notifications.length == 0 && (
                    <>
                      <h3 className="notificationTitle">Notification center</h3>
                      <div className="notificationEmptyDesc">
                        Here you will find new notifications. Nothing here so
                        far...
                      </div>
                    </>
                  )}
                </div>
                <div className="bottomControls">
                  <div className="markReadAllBtn" onClick={handleRead}>
                    <span className="closeText">Mark all as read</span>
                    <MarkAsUnreadOutlined />
                  </div>
                  <div
                    className="closeBtn"
                    onClick={() => setNotificationPop(false)}
                  >
                    <span className="closeText">Close</span>
                    <Close />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="topbarAccount">
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "/person/noAvatar.png"
              }
              alt=""
              className="topbarImg"
            />
          </Link>
          <Logout className="LogoutIcon" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
