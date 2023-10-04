import "./dogProfile.css";
import { CameraAlt } from "@mui/icons-material";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import DogProfileRightBar from "../../components/dogProfileRightbar/DogProfileRightBar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import DogFeed from "../../components/dogFeed/DogFeed";
import { AuthContext } from "../../context/AuthContext";

export default function DogProfile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [dog, setDog] = useState({});
  const dogname = useParams().dogname;
  const [file, setFile] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (dogname) {
      const fetchDog = async () => {
        const res = await axios.get(`/dog?dogName=${dogname}`);
        setDog(res.data);
      };

      fetchDog();
    }
  }, [dogname]);

  const coverImageHandler = async (e) => {
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
        const putResponse = await axios.put(`/dog/${dog._id}`, {
          cover_image: imageName,
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
        const putPhotoResponse = await axios.put(`/dog/${dog._id}`, {
          image: imageName,
        });

        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // const [user, setUser] = useState({});
  // const [role, setRole] = useState({});

  // useEffect(() => {
  //   const localUser = localStorage.getItem("user");
  //   const localRole = localStorage.getItem("role");
  //   setUser(JSON.parse(localUser));
  //   setRole(JSON.parse(localRole));
  // }, []);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />

        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  dog.cover_image ? PF + dog.cover_image : PF + "noDogCover.png"
                }
                alt=""
                className="profileCoverImg"
              />

              {currentUser._id === dog.userId ? (
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
                  src={dog.image ? PF + dog.image : PF + "noDogAvatar.png"}
                  alt=""
                  className="profileUserImg"
                />
                {currentUser._id === dog.userId ? (
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
              <h4 className="profileInfoName">{dog.name}</h4>
            </div>
          </div>

          <div className="profileRightBottom">
            <DogFeed dog_id={dog._id} />
            <DogProfileRightBar dog_id={dog._id} />
          </div>
        </div>
      </div>
    </>
  );
  //   <div>DogProfile</div>;
}
