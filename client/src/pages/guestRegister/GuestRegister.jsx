import "./guestRegister.css";
import { useEffect, useState, useContext } from "react";
import { HowToReg } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function GuestRegister() {
  const userIdentifier = useParams().userId;
  const email = useParams().email;
  const [user, setUser] = useState({});

  const [guestEmail, setGuestEmail] = useState(email);
  const [guestUsername, setGuestUsername] = useState("");
  const [guestPassword, setGuestPassword] = useState("");

  useEffect(() => {
    if (userIdentifier) {
      const fetchUser = async () => {
        const res = await axios.get(`/users?userId=${userIdentifier}`);
        setUser(res.data);
      };
      fetchUser();
    }
  }, [userIdentifier]);

  const handleGuestRegistration = async (e) => {
    e.preventDefault();

    //dodać walidację jak w DogRegister.jsx

    try {
      await axios
        .post(`/guest`, {
          username: guestUsername,
          email: guestEmail,
          password: guestPassword,
          userId: userIdentifier,
        })
        .then(() => (window.location.href = `/loginguest`));
    } catch (err) {
      console.log(err);
    }

    //console.log("UserId:" + userId);
    //console.log("User:" + JSON.stringify(user));
  };

  /*
  useEffect(() => {
    console.log("Guest username:" + guestUsername);
  }, [guestUsername]);

  useEffect(() => {
    console.log("Guest password:" + guestPassword);
  }, [guestPassword]);
  */

  return (
    <>
      <div className="container">
        <div className="flashCard">
          <h2 className="guestRegistrationTitle">Guest registartion</h2>
          <form className="formClass">
            <span className="registrationDisclaimer">
              The guest registration was issued by user <b>{user.username}</b>.
              Fill this form for user to be able to take care of dog that the
              user want you to take care of them.
            </span>

            <hr className="hrSeparator" />
            <span className="usernameText">Username:</span>
            <br />
            <input
              type="text"
              className="usernameInput"
              onChange={(e) => setGuestUsername(e.target.value)}
            ></input>
            <br />
            <span className="emailText">Email:</span>
            <br />
            <input
              type="email"
              className="emailInput"
              onChange={(e) => setGuestEmail(e.target.value)}
              value={guestEmail}
              disabled
            ></input>
            <br />
            <span className="passwordText">Password:</span>
            <br />
            <input
              type="password"
              className="passwordInput"
              onChange={(e) => setGuestPassword(e.target.value)}
            ></input>
            <br />
            <button className="RegisterBTN" onClick={handleGuestRegistration}>
              <span className="registerText">Register</span>
              <HowToReg className="registerIcon" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
