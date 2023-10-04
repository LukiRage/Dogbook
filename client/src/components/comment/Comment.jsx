import { Send, Delete, Edit, Save } from "@mui/icons-material";
import "./comment.css";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Import kontekstu autentykacji
import { format } from "timeago.js";
import { io } from "socket.io-client"; //notifications
import { Link } from "react-router-dom";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Comment({ postId, postCreator }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState(""); // Stan dla treści komentarza
  const { user } = useContext(AuthContext); // Pobierz zalogowanego użytkownika z kontekstu

  //const [isEditingComment, setIsEditingComment] = useState(false); //edycja komentarza
  const [editingStates, setEditingStates] = useState(comments.map(() => false));

  const [editedCommentDescription, setEditedCommentDescription] = useState(""); //treść aktualnie edytowanego komantarza

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [updateConfirmation, setUpdateConfirmation] = useState(false);

  //comment notification
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
        senderName: user.username,
        //receiverName: user.username,
        receiverId: postCreator,
        type,
        link: `/post/${postId}`,
      });
    }
  };

  ////////////////////////////////////////////////

  //Wyświetlanie posta
  useEffect(() => {
    const endpoint = `http://localhost:8800/api/posts/comment/${postId}`;

    axios
      .get(endpoint)
      .then((response) => {
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error("Błąd pobierania komentarzy:", error);
      });
  }, [postId]);

  const handleCommentSubmit = async (description) => {
    try {
      const response = await axios.post(
        `http://localhost:8800/api/posts/comment/${postId}`,
        {
          user_id: user._id, // Ustaw autora komentarza na zalogowanego użytkownika
          description: description,
          likes: [],
        }
      );
      //.then(
      //console.log("Response after comment:", response.data))
      handleNotification(2);
      window.location.reload();
    } catch (error) {
      console.log(postId);
      console.error("Błąd podczas dodawania komentarza:", error);
    }
  };

  const handleDeleteComment = async (
    post_id,
    commentId,
    commentOwnerId,
    requestingUserId,
    setDeleteConfirmation
  ) => {
    console.log("Delete icon pushed");
    if (commentOwnerId === requestingUserId) {
      const confirmDelete = window.confirm(
        "Do you really want to delete this comment?"
      );
      if (confirmDelete) {
        try {
          const response = await axios.delete(
            `/posts/comment/${post_id}/${commentId}`,
            {
              data: {
                user_id: requestingUserId,
              },
            }
          );
          console.log("Response after delete:", response.data);
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  //edycja komentarza
  const handleCommentEditClick = (index, description) => {
    setEditingStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = !newState[index];
      return newState;
    });

    //pobrać treść do zmiennej setEditedCommentDescription()
    setEditedCommentDescription(description);
  };

  const handleUpdateComment = async (
    post_id,
    commentId,
    commentOwnerId,
    requestingUserId,
    commentDescription,
    originalCommentDescription
  ) => {
    console.log("Edit icon pushed");

    console.log("post_id:" + post_id);
    console.log("commentId:" + commentId);
    console.log("commentOwnerId:" + commentOwnerId);
    console.log("requestingUserId:" + requestingUserId);
    console.log("commentDescription:" + commentDescription);

    if (commentOwnerId === requestingUserId) {
      // Check if there are updates
      if (commentDescription !== originalCommentDescription) {
        const confirmUpdate = window.confirm(
          "Do you really want to update this comment?"
        );
        if (confirmUpdate) {
          try {
            const response = await axios.put(
              `/posts/comment/edit/${post_id}/${commentId}`,
              {
                description: commentDescription,
                user_id: requestingUserId,
              }
            );
            console.log("Response after edit:", response.data);
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        // No updates, don't show confirmation
        try {
          const response = await axios.put(
            `/posts/comment/edit/${post_id}/${commentId}`,
            {
              description: commentDescription,
              user_id: requestingUserId,
            }
          );
          console.log("Response after edit:", response.data);
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <div className="commentWrapper">
      <hr className="commentHr" />
      {comments.map((comment, index) => (
        <div className="commentSingle" key={comment._id}>
          <div className="commentHeader">
            <Link
              key={comment.user_id._id}
              to={`profile/${comment.user_id.username}`}
            >
              <img
                src={
                  comment.user_id.profilePicture
                    ? PF + comment.user_id.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>

            <div className="commentUsername">
              <b>
                {comment.user_id === user._id ? "Ty" : comment.user_id.username}
              </b>
            </div>
            <div className="commentTime">{format(comment.createdAt)}</div>
            <div className="spacer"></div>
            {comment.user_id._id === user._id ? (
              <Delete
                className="deleteIcon"
                onClick={() => {
                  handleDeleteComment(
                    postId,
                    comment._id,
                    comment.user_id._id,
                    user._id
                  ); //postId,commentId,commentOwnerId,requestingUserId
                }}
              />
            ) : (
              ""
            )}

            {comment.user_id._id === user._id ? (
              <Edit
                className="editIcon"
                onClick={() => {
                  handleCommentEditClick(index, comment.description); // Pass the index to identify the clicked comment
                }}
              />
            ) : (
              ""
            )}
          </div>
          <div
            className="commentDescription"
            style={
              editingStates[index] ? { display: "none" } : { display: "block" }
            }
          >
            {comment.description}
          </div>
          <div
            className="commentDescriptionEdit"
            style={
              editingStates[index] ? { display: "block" } : { display: "none" }
            }
          >
            <textarea
              placeholder=""
              className="commentArea"
              value={editedCommentDescription}
              onChange={(e) => setEditedCommentDescription(e.target.value)}
            />
            <Save
              className="saveIcon"
              onClick={() => {
                handleUpdateComment(
                  postId,
                  comment._id,
                  comment.user_id._id,
                  user._id,
                  editedCommentDescription
                );
              }}
            />
          </div>
        </div>
      ))}
      <div className="commentSection">
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/person/noAvatar.png"
            }
            alt=""
            className="userImg"
          />
        </Link>
        <div className="commentSubmission">
          <input
            placeholder="Write comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="commentInput"
          />

          <Send
            className="commentIcon"
            onClick={() => handleCommentSubmit(commentText)}
          />
        </div>
      </div>
    </div>
  );
}
