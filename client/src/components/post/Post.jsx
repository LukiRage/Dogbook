import "./post.css";
import { MoreVert } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Comment from "../../components/comment/Comment";
import { io } from "socket.io-client"; //notifications

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description); // Dodaj stan do przechowywania edytowanej treści
  const [isEditing, setIsEditing] = useState(false); // Dodaj stan do śledzenia trybu edycji

  //post notification
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
        receiverId: user._id,
        type,
        link: `/post/${post._id}`,
      });
    }
  };

  ////////////////////////////////////////////////

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);

    if (!isLiked) {
      handleNotification(1);
    } //send notification to the post owner
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditClick = () => {
    setIsMenuOpen(false);
    setIsEditing(true); // Włącz tryb edycji
    setEditedDescription(post.description);
  };

  const handleSaveEditClick = async () => {
    const shouldUpdate = window.confirm("Do you want to save the changes?");

    if (!shouldUpdate) {
      setIsMenuOpen(false);
      setIsEditing(false);
      return; // Don't update if the user cancels
    }

    try {
      const response = await axios.put(
        `http://localhost:8800/api/posts/${post._id}`,
        {
          userId: currentUser._id,
          description: editedDescription,
        }
      );
      console.log("Response after edit:", response.data);
      // Perform appropriate actions after editing the post, e.g., refreshing the post list
      setIsEditing(false); // Turn off edit mode after saving changes
      window.location.reload();
    } catch (error) {
      console.error("Error while editing the post:", error);
    }
    setIsMenuOpen(false);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) {
      setIsMenuOpen(false);
      return;
    }

    try {
      if (currentUser._id === post.userId) {
        const response = await axios.delete(
          `http://localhost:8800/api/posts/${post._id}`,
          {
            data: { userId: currentUser._id },
          }
        );
        console.log("Response after delete:", response.data);
        window.location.reload();
        // Perform appropriate actions after deleting the post, e.g., refresh the post list
      } else {
        console.log("You are not the author of this post.");
      }
    } catch (error) {
      console.error("Error while deleting the post:", error);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId === currentUser._id ? (
              <MoreVert className="MorevertView" onClick={handleMenuClick} />
            ) : (
              ""
            )}
            {isMenuOpen && (
              <div className="postOptionsMenu">
                <span className="spanOption" onClick={handleEditClick}>
                  <EditIcon />
                  Edytuj
                </span>
                <br />
                <span className="spanOption" onClick={handleDeleteClick}>
                  <DeleteIcon />
                  Usuń
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          {/*Pole do wpisywania edycji desc*/}
          {isEditing ? (
            <input
              placeholder=""
              className="textArea"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          ) : (
            <span className="postText">{post?.description}</span>
          )}
          {/*Przycisk zapisz zmiany*/}
          <br />
          {isEditing && (
            <button className="saveChangesButton" onClick={handleSaveEditClick}>
              Zapisz zmiany
            </button>
          )}

          {/*Zdjecie*/}
          <img className="postImg" src={PF + post.image} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {post.comments.length} comments
            </span>
          </div>
        </div>
        <div className="commentSection">
          <Comment postId={post._id} postCreator={post.userId} />
        </div>
      </div>
    </div>
  );
}
