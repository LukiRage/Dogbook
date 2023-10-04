import "./guestManager.css";
import { Send } from "@mui/icons-material";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import DogCaretaker from "../dogCaretaker/DogCaretaker";

export default function GuestManager() {
  const [dogList, setDogList] = useState([]);
  const { user, role } = useContext(AuthContext);

  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    if (user._id && user) {
      if (role === "LoginUser") {
        const fetchOwnedDogs = async () => {
          try {
            const dogsResponse = await axios.get("/dog/byUser/" + user._id);
            //console.log("dogsResponse:", dogsResponse.data);
            setDogList(dogsResponse.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchOwnedDogs();
      }
    }
  }, []);

  const handleStartGuestRegistration = async () => {
    //dołożyć walidację pól jak w DogRegister.jsx

    //console.log("Email:" + guestEmail);
    //console.log("ID:" + user._id);

    try {
      await axios
        .post(`/guest/registration/mail`, {
          email: guestEmail,
          userId: user._id,
        })
        .then(() => {
          alert("Email has been sent!");
        });
    } catch (err) {
      console.log(err);
    }
  };

  //get list of guests for user
  const [currentUser, setCurrentUser] = useState({});
  const [registeredGuest, setRegisteredGuest] = useState([]);

  useEffect(() => {
    if (user._id !== "" && user._id !== undefined) {
      const fetchUser = async () => {
        const res = await axios.get(`/users?userId=${user._id}`);
        setCurrentUser(res.data);
      };
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    if (currentUser.guestArr) {
      const fetchRegisteredGuest = async (guestId) => {
        try {
          const res = await axios.get(`/guest/getUsername/${guestId}`);
          // Create a new array by spreading the current registeredGuest and adding the new guest data
          setRegisteredGuest((prevGuests) => [...prevGuests, res.data]);
        } catch (error) {
          // Handle errors here if necessary
        }
      };

      //console.log(currentUser.guestArr);

      currentUser.guestArr.forEach((guestId) => {
        fetchRegisteredGuest(guestId);
        //console.log(guestId);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (registeredGuest.length > 0) {
      const uniqueGuests = {};

      const filteredGuests = registeredGuest.filter((guest) => {
        const key = guest._id;

        if (!uniqueGuests[key]) {
          uniqueGuests[key] = true;
          return true;
        }

        return false;
      });

      // Check if the filteredGuests are different from the current registeredGuest
      if (JSON.stringify(filteredGuests) !== JSON.stringify(registeredGuest)) {
        setRegisteredGuest(filteredGuests);
      }
    }
  }, [registeredGuest]);

  return (
    <>
      <div className="managerWrapper">
        <h3 className="guestManagerTitle">Register new guest:</h3>
        <input
          type="email"
          placeholder="e-mail@domain.com"
          className="emailInput"
          onChange={(e) => setGuestEmail(e.target.value)}
        ></input>
        <button className="addGuest" onClick={handleStartGuestRegistration}>
          <span className="sendText">Send invitation</span>
          <Send />
        </button>
        <hr className="separator" />
        <h4 className="guestManagerSubtitle">Manage dog caretakers:</h4>
        <ul className="dogList">
          {dogList.map((dog) => (
            <li key={dog._id} className="listElement">
              {/* <span className="dogName">{dog.name}</span> */}

              <DogCaretaker
                dog={dog}
                user={user}
                caretakerList={registeredGuest}
              />

              {/* <select className="caretakerName">
                <option>brak</option>
                <option>test</option>
              </select> */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
