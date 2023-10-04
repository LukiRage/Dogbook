import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./event.css";
import axios from "axios";
import EventElement from "../../components/eventElement/EventElement";
import { useEffect, useState } from "react";
import AddEvent from "../../components/addEvent/AddEvent";

export default function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const performEventFetch = async () => {
      try {
        const result = await axios.get(`/event/list`);
        setEvents(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    performEventFetch();
  }, []);

  // useEffect(() => {
  //   console.log(JSON.stringify(events));
  // }, [events]);

  //console.log(JSON.stringify(events[0]));

  return (
    <>
      <Topbar />
      <div className="event">
        <Sidebar />
        <div className="eventRightPanel">
          {events.map((event) => (
            <EventElement object={event} key={event._id} />
          ))}

          {/* <EventElement /> */}
          <AddEvent />
        </div>
      </div>
    </>
  );
}
