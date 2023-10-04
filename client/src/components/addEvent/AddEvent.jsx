import "./addEvent.css";
import { AddCircleOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddEvent() {
  const today = new Date().toISOString().split("T")[0];

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const formattedTomorrowDate = currentDate.toISOString().split("T")[0];

  const [addFormVisible, setAddFormVisible] = useState(false);

  //form values for submission
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");

  const [imageName, setImageName] = useState("");

  useEffect(() => {
    console.log("Event name:" + eventName);
  }, [eventName]);

  useEffect(() => {
    console.log("Event description:" + eventDescription);
  }, [eventDescription]);

  useEffect(() => {
    console.log("Event start:" + eventStart);
  }, [eventStart]);

  useEffect(() => {
    console.log("Event start time:" + eventStartTime);
  }, [eventStartTime]);

  useEffect(() => {
    console.log("Event end:" + eventEnd);
  }, [eventEnd]);

  const havdleEventImageSend = async (e) => {
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
        setImageName("/uploaded/" + response.data.fileName);
      } catch (err) {
        setImageName("");
      }
    }
  };

  const handleAddingNewEvent = async () => {
    console.log("Function");

    const timeDateStart = eventStart + "T" + eventStartTime + ":00.000+00:00";
    const timeDateEnd = eventEnd + "T" + eventEndTime + ":00.000+00:00";

    if (imageName === "") {
      //zapytanie bez obrqazka
      const response = await axios
        .post(`/event`, {
          title: eventName,
          description: eventDescription,
          expiredIn: timeDateEnd,
          startDate: timeDateStart,
        })
        .then(() => {
          window.location.reload();
        });
    } else {
      //z obrazkiem
      const response = await axios
        .post(`/event`, {
          title: eventName,
          description: eventDescription,
          expiredIn: timeDateEnd,
          startDate: timeDateStart,
          image: imageName,
        })
        .then(() => {
          window.location.reload();
        });
    }
  };

  return (
    <>
      <div className="elementWrapper">
        <label htmlFor="file" className="topSection">
          {/* <div > */}
          <AddCircleOutline className="plusIcon" sx={{ fontSize: "150px" }} />
          {/* </div> */}
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            accept=".png, .jpeg, .jpg"
            onChange={(e) => havdleEventImageSend(e)}
          />
        </label>
        <div className="bottomSection">
          <div className="addInfo">
            {/* <span>Create new timed event</span> */}

            <div className="addForm">
              <input
                className="eventName"
                type="text"
                placeholder="Event name"
                onChange={(e) => setEventName(e.target.value)}
              ></input>
              <textarea
                className="eventDescription"
                placeholder="Event desctiption"
                onChange={(e) => setEventDescription(e.target.value)}
              ></textarea>
              Event start time:
              <input
                className="eventStart"
                type="date"
                min={today}
                onChange={(e) => setEventStart(e.target.value)}
              />
              <input
                type="time"
                className="eventStartTime"
                onChange={(e) => setEventStartTime(e.target.value)}
              />
              Event end time:
              <input
                className="eventEnd"
                type="date"
                min={formattedTomorrowDate}
                onChange={(e) => setEventEnd(e.target.value)}
              />
              <input
                type="time"
                className="eventEndTime"
                onChange={(e) => setEventEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="buttondiv">
            <button className="addEvent" onClick={handleAddingNewEvent}>
              Add new event
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
