import "./closeFriend.css";

import { Link } from "react-router-dom";

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="sidebarFriend">
      <Link
        key={user._id}
        to={"/profile/" + user.username}
        style={{ textDecoration: "none" }}
        className="linkClass"
      >
        <img
          src={
            user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"
          }
          alt=""
          className="sidebarFriendImg"
        />
        <span className="sidebarFirendName">{user.username}</span>
      </Link>
    </li>
  );
}
