import "./eventElement.css";
import { StarBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

export default function EventElement({ object }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);

  // useEffect(() => {
  //   console.log(JSON.stringify(object.members));
  // }, [object]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInterested = async () => {
    //console.log(user.username);

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
                  <p>Interested users:</p>
                  <ul>
                    {object.members.map((member) => (
                      <li key={member}>{member}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <button className="interestedButton" onClick={handleInterested}>
            <StarBorder className="starButton" />
            <span className="interestedText">Interested</span>
          </button>
        </div>
      </div>
    </>
  );
}
