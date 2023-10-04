import "./dogProfileRightbar.css";

import { Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import BreedAdvantage from "../breedAdvantage/BreedAdvantage";
//import BreedDisadvantage from "../breedDisadvantage/BreedDisadvantage";

export default function DogProfileRightBar({ dog_id }) {
  const [dog, setDog] = useState({});
  const [dogBreed, setDogBreed] = useState({});

  const [lastActivity, setLastActivity] = useState({});

  const [updateAge, setAge] = useState(0);
  const [updateWeight, setWeight] = useState(0);
  const [editVisible, setEditVisible] = useState(false);

  //fetch dog data from DB
  useEffect(() => {
    if (dog_id) {
      const fetchDog = async () => {
        const res = await axios.get(`/dog?dogId=${dog_id}`);
        setDog(res.data);
      };

      fetchDog();
    }
  }, [dog_id]);

  useEffect(() => {
    if (dog) {
      setAge(dog.age);
      setWeight(dog.weight);
    }
  }, [dog]);

  //fetch breed data for current dog
  useEffect(() => {
    if (dog.breedId) {
      const fetchDog = async () => {
        const res = await axios.get(`/breed/${dog.breedId}`);
        setDogBreed(res.data);
      };

      fetchDog();
    }
  }, [dog.breedId]);

  //fetch last activity
  useEffect(() => {
    if (dog_id) {
      const fetchDogActivity = async () => {
        const res = await axios.get(`/dog/activity/newest/${dog_id}`);
        setLastActivity(res.data);
      };

      fetchDogActivity();
    }
  }, [dog_id]);

  const numberPattern = /^\d+$/; // Only digits
  const decimalPattern = /^\d+(\.\d+)?$/;
  const handleEdit = async () => {
    if (editVisible) {
      console.log("Edit:" + editVisible);
      if (
        !numberPattern.test(updateAge) ||
        !decimalPattern.test(updateWeight)
      ) {
        alert("The weight and age should be numbers");
        console.log("Validation error");
        // setAge(dog.age);
        // setWeight(dog.weight);
      } else if (updateAge >= 20) {
        alert("The age should be number in range 1-20");
      } else {
        console.log("Sending request");

        try {
          const result = await axios
            .put(`/dog/${dog._id}`, {
              age: updateAge,
              weight: updateWeight,
            })
            .then(() => {
              window.location.reload();
            });
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      console.log("Editing");
    }

    setEditVisible(!editVisible);
    //console.log("Handle Edit: " + editVisible);
  };

  return (
    <>
      <div className="dog_rightbar">
        <div className="dog_rightbarWrapper">
          <div className="ProfileInfoTitle">
            <h4 className="rightbarTitle">Dog information</h4>
            <Edit className="editProfileInfo" onClick={handleEdit} />
          </div>
          <div className="rightbarInfo">
            <div className="rightbarInfoItem">
              <span>Age: </span>

              {editVisible ? (
                <input
                  className="inputAgeWeight"
                  type="number"
                  onChange={(e) => setAge(e.target.value)}
                  value={updateAge}
                />
              ) : (
                <span>{dog.age}</span>
              )}
            </div>

            <div className="rightbarInfoItem">
              <span>Weight: </span>

              {editVisible ? (
                <input
                  className="inputAgeWeight"
                  type="number"
                  onChange={(e) => setWeight(e.target.value)}
                  value={updateWeight}
                ></input>
              ) : (
                <span>{dog.weight}</span>
              )}
            </div>

            <div className="rightbarInfoItem">
              <span>Gender: {dog.gender ? "male" : "famale"}</span>
            </div>

            <div className="rightbarInfoItem">
              <span>Breed: {dogBreed.name}</span>
            </div>

            <div className="rightbarInfoItem">
              <span className="greyedTitle">Breed advantages:</span>
              <ul>
                {/* Map through advantages and list only their names */}
                {dogBreed.breed_advantage ? (
                  dogBreed.breed_advantage.map((advantage, index) => (
                    // <li key={index} className="greyedTitle">
                    //   {advantage.name} - {advantage.description}
                    // </li>
                    <BreedAdvantage
                      key={index}
                      advantage={advantage}
                      index={index}
                    />
                  ))
                ) : (
                  <li>No advantages available</li>
                )}
              </ul>
            </div>

            <div className="rightbarInfoItem">
              <span className="greyedTitle">Breed disadvantages:</span>

              <ul>
                {dogBreed.breed_disadvantage ? (
                  dogBreed.breed_disadvantage.map((disadvantage, index) => (
                    // <li key={index} className="greyedTitle">
                    //   {disadvantage.name} - {disadvantage.description}
                    // </li>
                    <BreedAdvantage
                      key={index}
                      advantage={disadvantage}
                      index={index}
                    />
                  ))
                ) : (
                  <li>No disadvantages available</li>
                )}
              </ul>
            </div>

            {/* <div className="rightbarInfoItem">
              <span>Status: {dog.status}</span>
            </div> */}
          </div>

          <span>Latest activity gif</span>
          <div className="gifWrapper">
            <img src={lastActivity.image} alt="" className="gifClass" />
          </div>
        </div>
      </div>
    </>
  );
}
