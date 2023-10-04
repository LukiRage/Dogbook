import "./profile.css";

import { CameraAlt } from "@mui/icons-material";

import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [loggedUserId, setLoggedUserId] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };

    fetchUser();
  }, [username]);

  const coverImageHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const response = await axios.post("/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const imageName = "/uploaded/" + response.data.fileName;
        console.log("User id:" + user._id);
        const putResponse = await axios.put(`/users/${user._id}`, {
          coverPicture: imageName,
          userId: user._id,
        });

        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const photoImageHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      //console.log("File is attached");
      const data = new FormData();
      data.append("file", file);
      try {
        const response = await axios.post("/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const imageName = "/uploaded/" + response.data.fileName;
        const putPhotoResponse = await axios.put(`/users/${user._id}`, {
          profilePicture: imageName,
          userId: user._id,
        });

        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar user={user} />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "noCover.png"
                }
                alt=""
                className="profileCoverImg"
              />

              {currentUser._id === user._id ? (
                <label htmlFor="file" className="coverUpdate">
                  <CameraAlt className="backgroundSettingsIcon" />
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    accept=".png, .jpeg, .jpg"
                    onChange={(e) => coverImageHandler(e)}
                  />
                </label>
              ) : (
                ""
              )}

              <div className="photoWrapper">
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "noAvatar.png"
                  }
                  alt=""
                  className="profileUserImg"
                />
                {currentUser._id === user._id ? (
                  <label htmlFor="filePhoto" className="photoUpdate">
                    <CameraAlt className="photoSettingsIcon" />
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="filePhoto"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => photoImageHandler(e)}
                    />
                  </label>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.description}</span>
            </div>
          </div>

          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar page_type="profile" user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
