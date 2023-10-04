import "./share.css";
import {
  Cancel,
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
} from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const description = useRef();
  const [file, setFile] = useState(null);

  const [pickerVisible, setPickerVisible] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      description: description.current.value,
    };
    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const response = await axios.post("/upload", data);
        newPost.image = "/uploaded/" + response.data.fileName; // Ustaw nazwę pliku z odpowiedzi serwera
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={description}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {/* <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div> */}
            {/* <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div> */}
            <div
              className="shareOption"
              onClick={() => setPickerVisible(!pickerVisible)}
            >
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
            {pickerVisible == true && (
              <div className="pickerWrapper">
                <EmojiPicker
                  onEmojiClick={(emoji) =>
                    (description.current.value += emoji.emoji)
                  }
                />
              </div>
            )}
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>

        <div className="shareBottom"></div>
      </div>
    </div>
  );
}
