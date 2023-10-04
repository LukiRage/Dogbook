import "./settingsPage.css";
import { Delete } from "@mui/icons-material";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [guestArray, setGuestArray] = useState([]);
  const [dogArray, setDogArray] = useState([]);

  useEffect(() => {
    if (user) {
      const getGuestsData = async () => {
        try {
          const guestListData = await axios.get(
            `guest/guests_for_user/${user._id}`
          );
          setGuestArray(guestListData.data);
        } catch (err) {
          console.log(err);
        }
      };
      getGuestsData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchOwnedDogs = async () => {
        try {
          const dogsResponse = await axios.get("/dog/byUser/" + user._id);
          //console.log("dogsResponse:", dogsResponse.data);
          setDogArray(dogsResponse.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchOwnedDogs();
    }
  }, [user]);

  //   useEffect(() => {
  //     console.log(JSON.stringify(dogArray));
  //   }, [dogArray]);

  const deleteGuest = async (guestId) => {
    if (window.confirm("Do you really want to delete guest?")) {
      try {
        console.log("Deleting guest:" + guestId);
        const deleteGuest = await axios.delete(
          //`/guest/delete_by_guestid/${guestId}`
          `/guest/delete_guest/${user._id}/${guestId}`
        );
        console.log(deleteGuest.data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deleteDog = async (dogId) => {
    if (window.confirm("Do you really want to delete dog?")) {
      try {
        console.log("Deleting dog:" + dogId);
        const deleteDog = await axios.delete(`/dog/${dogId}`);
        console.log(deleteDog.data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Do you really want to delete your account?")) {
      try {
        //delete all guests
        const deleteAllGuest = await axios.delete(
          `/guest/delete_all_guests/${userId}`
        );
        console.log("Guest deleting:" + deleteAllGuest.data);
      } catch (err) {
        console.log(err);
      }

      try {
        //delete all dogs
        const deleteAllDog = await axios.delete(
          `/dog/delete_all_dogs/${userId}`
        );
        console.log("Dogs deleting:" + deleteAllDog.data);
      } catch (err) {
        console.log(err);
      }

      try {
        //delete user account
        const deleteUser = await axios.delete(`/users/${userId}`);

        console.log("User deleting:" + deleteUser.data);
      } catch (err) {
        console.log(err);
      }

      localStorage.clear();

      window.location.reload();
    }
  };

  return (
    <>
      <Topbar />
      <div className="settingsContainer">
        <Sidebar user={user} className="sidebar" />

        {/* <Feed className="feed" />
        <Rightbar page_type="home" user_id={user._id} className="rightbar" /> */}
        <div className="settingsWrapper">
          <div className="settingsPane">
            <h1 className="settingsTitle">Settings</h1>
            <div className="deleteGuestSection">
              <h3 className="guestTitle">Delete Guest</h3>
              <span className="spanText">
                In this section you can delete registered guests account and
                unlink them from your account. To delete guest simply click
                delete button next to the account details. This is irreversable
                operation.
              </span>

              <table>
                <tbody>
                  {guestArray.map((guest, index) => (
                    <tr key={index}>
                      <td>{guest.username}</td>
                      <td>{guest.email}</td>
                      <td>
                        <button
                          className="deleteBtn"
                          onClick={() => deleteGuest(guest._id)}
                        >
                          <Delete /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="deleteDogSection">
              <h3 className="dogTitle">Delete dog</h3>
              <span className="spanText">
                In this section you can delete your dog and all of the details
                saved to their profile. Use this in case you are no longer the
                owner of the dog, or if the dog has passed away. This is
                irreversable operation.
              </span>

              <table>
                <tbody>
                  {dogArray.map((dog, index) => (
                    <tr key={index}>
                      <td>{dog.name}</td>
                      <td>
                        <button
                          className="deleteBtn"
                          onClick={() => deleteDog(dog._id)}
                        >
                          <Delete /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="geleteUserSection">
              <h3 className="userTitle">Delete user account</h3>
              <span className="spanText">
                In this section you can delete your account and all data
                associated with it. This is irreversable operation.
              </span>
              <div>
                <button
                  className="userDelete"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
