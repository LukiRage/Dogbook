import "./messenger.css";

import { Send, AddComment } from "@mui/icons-material";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const [socket, setSocket] = useState(null);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef(null);

  //search for friends
  const [chatFriendSearch, setChatFriendSearch] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [filteredSearchQuery, setFilteredSearchQuery] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [searchedConversation, setSearchedConversation] = useState({});

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    ////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    //message notification
    socket.current.emit("sendNotification", {
      senderName: user.username,
      //receiverName: user.username,
      receiverId: receiverId,
      type: 4,
      link: `/messenger`,
    });
    //////////////////////////////

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //handle search results
  useEffect(() => {
    if (chatFriendSearch !== "") {
      console.log("Wyszukuje .." + chatFriendSearch);
      //console.log("W zbiorze: " + JSON.stringify(friendList[0]));

      setFilteredSearchQuery(
        friendList.filter((friend) =>
          friend.username.includes(chatFriendSearch)
        )
      );

      // Log the matching records
      console.log("Matching records: ", filteredSearchQuery);
    }
  }, [chatFriendSearch]);

  useEffect(() => {
    if (user._id) {
      const fetchFiendlist = async () => {
        try {
          const res = await axios.get("/users/friends/" + user._id);
          setFriendList(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchFiendlist();
    }
  });

  //create Conwersation if does not exist
  const handleAddConversation = async (conversationDestination) => {
    console.log("Do użytkownika:" + conversationDestination);
    //check if the conversation exists
    //setSearchedConversation()

    const findConvo = async () => {
      const res = await axios.get(
        `/conversations/find/${user._id}/${conversationDestination}`
      );
      setSearchedConversation(res.data);
    };

    const createConvo = async () => {
      const createRes = await axios.post(`/conversations`, {
        senderId: user._id,
        receiverId: conversationDestination,
      });
    };

    findConvo();

    if (searchedConversation) {
      //true (conversation exists) ->> set current conversation to that conversation
      //przekieruj do docelowej konwersacji

      console.log("Conversation exists");
      setCurrentChat(searchedConversation);
    } else {
      //if the conversation does not exist ->> create one
      //false (conversation not found) ->> create new conversation

      console.log("Creating new convo");
      const createRes = await axios
        .post(`/conversations`, {
          senderId: user._id,
          receiverId: conversationDestination,
        })
        .then(() => {
          findConvo();
        })
        .then(() => {
          setCurrentChat(searchedConversation);
        })
        .then(() => {
          //aktualizacja sidebaru
          window.location.reload();
        });
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for the friends"
              className="chatMenuInput"
              onChange={(e) => setChatFriendSearch(e.target.value)}
            />
            {filteredSearchQuery.length > 0 ? (
              <div className="searchResults">
                {filteredSearchQuery.map((element) => (
                  <div
                    className="searchResult"
                    key={element._id}
                    onClick={() => handleAddConversation(element._id)}
                  >
                    <img
                      className="searchResultImg"
                      src={
                        element?.profilePicture
                          ? PF + element.profilePicture
                          : PF + "/person/noAvatar.png"
                      }
                      alt=""
                    />

                    {element.username}

                    <AddComment />
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            {conversations.map((c) => (
              <div
                key={c._id}
                onClick={() => {
                  setCurrentChat(c);
                }}
              >
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, index) => (
                    <div key={index} ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something ..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    <Send />
                    <p className="sendText">Send</p>
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                {" "}
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
