import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    setUser(JSON.parse(localUser));
  }, []);

  /*
  Pobieranie danych z localStorage i parsowanie na obiekty:
    const textUser = localStorage.getItem("user");
    const user = JSON.parse(textUser);
    console.log("USER:" + JSON.stringify(user));
  */

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar user={user} className="sidebar" />
        <Feed className="feed" />
        <Rightbar page_type="home" user_id={user._id} className="rightbar" />
      </div>
    </>
  );
}
