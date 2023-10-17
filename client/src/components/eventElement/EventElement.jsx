import "./eventElement.css";
import { StarBorder, Star } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

export default function EventElement({ object }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);

  const [isInterested, setIsInterested] = useState(false);
  const [friendList, setFriendList] = useState([]);

  //sprawdzenie czy zainteresowany użytkownik jest
  useEffect(() => {
    setIsInterested(object.members.includes(user.username));
  }, [object]);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await axios.get(`/users/friends/${user._id}`);
      setFriendList(res.data);
    };
    fetchFriends();
  }, [object]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInterested = async () => {
    //console.log(user.username);

    if (isInterested) {
      try {
        await axios
          .put(`/event/removemember/${user._id}/${object._id}`, {
            username: user.username,
          })
          .then(() => {
            window.location.reload();
          });
      } catch (err) {
        console.log(err);
        alert("You already uninterested this event");
      }
    } else {
      try {
        await axios
          .put(`/event/addmember/${user._id}/${object._id}`, {
            username: user.username,
          })
          .then(() => {
            window.location.reload();
          });
      } catch (err) {
        console.log(err);
        alert("You already interested this event");
      }
    }
  };

  return (
    <>
      <div className="elementWrapper">
        <img
          className="imageSection"
          src={object.image ? PF + object.image : PF + "noEvent.png"}
        />
        <div className="descriptionContainer">
          <div className="descriptionSection">
            <div className="titleSection">{object.title}</div>
            <div className="eventDate">{formatDate(object.startDate)}</div>
            <div className="descriptionText">{object.description}</div>
            <div className="eventMembers">
              {object.members.length > 0 && (
                <>
                  {/* //sprawdzenie czy tablica friendList zawiera elementy z tablicy object.members */}
                  {friendList.some((friend) =>
                    object.members.includes(friend.username)
                  ) ? (
                    <>
                      <p>Interested friends:</p>
                      <ul>
                        {isInterested && (
                          <li key={user.username}>{user.username}</li>
                        )}
                        {friendList.map((friend) =>
                          object.members.includes(friend.username) ? (
                            <li key={friend.username}>{friend.username}</li>
                          ) : null
                        )}
                      </ul>
                    </>
                  ) : null}

                  <p>
                    Total of: {object.members.length}
                    {object.members.length <= 1 ? " user" : " users"}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* dodać zmianę wyświetlenia w zależności  isInterested*/}

          {isInterested ? (
            <button
              className="interestedButtonActive"
              onClick={handleInterested}
            >
              <Star className="starButton" />
              <span className="interestedText">Uninterested</span>
            </button>
          ) : (
            <button className="interestedButton" onClick={handleInterested}>
              <StarBorder className="starButton" />
              <span className="interestedText">Interested</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
