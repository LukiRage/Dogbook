import "./dogProfileForGuest.css";
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

export default function DogProfileForGuest() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [dog, setDog] = useState({});
  const dogname = useParams().dogname;
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);

  //api/guest/dog_data_for_guest

  useEffect(() => {
    if (user) {
      const fetchDog = async () => {
        const res = await axios.get(`/guest/dog_data_for_guest/${user._id}`);
        setDog(res.data);
        console.log(res.data);
      };

      fetchDog();
    }
  }, [user]);

  //return <div>Test</div>;

  return (
    <>
      <Topbar guest_mode={true} />
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

              <div className="photoWrapper">
                <img
                  src={dog.image ? PF + dog.image : PF + "noDogAvatar.png"}
                  alt=""
                  className="profileUserImg"
                />
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
