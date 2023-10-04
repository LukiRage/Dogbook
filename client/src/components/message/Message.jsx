import React, { useEffect, useState } from "react";
import "./message.css";
import axios from "axios";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  const [user, setUser] = useState(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios(`/users?userId=${message.sender}`);
        setUser(res.data);
        setUserDataLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, [message.sender]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {userDataLoaded && (
          <img
            className="messageImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/person/noAvatar.png"
            }
            alt=""
          />
        )}
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
