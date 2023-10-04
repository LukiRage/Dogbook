import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./dogRegister.css";
import { AuthContext } from "../../context/AuthContext";

export default function DogRegister() {
  const [dog_name, setDogName] = useState("");
  const [dog_age, setAge] = useState(0);
  const [dog_weight, setWeight] = useState(0.0);
  const [dog_gender, setGender] = useState(true);
  const [dog_breed, setBreed] = useState("");
  const [breedList, setBreedList] = useState([]);

  const [cancelRegistration, setCancelRegistration] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (cancelRegistration) {
      window.location.href = "/";
    }
  }, [cancelRegistration]);

  useEffect(() => {
    const getBreedsAll = async () => {
      const result = await axios.get("/breed/all/breeds");
      setBreedList(result.data);
    };
    getBreedsAll();
  }, []);

  const cancelAction = () => {
    let isEmpty = true;
    if (!(dog_name === "")) {
      isEmpty = false;
    }

    if (!(dog_age === 0)) {
      isEmpty = false;
    }

    if (!(dog_weight === 0.0)) {
      isEmpty = false;
    }

    if (!(dog_breed === "")) {
      isEmpty = false;
    }

    if (isEmpty) {
      setCancelRegistration(true);
    } else {
      setCancelRegistration(window.confirm("Do you really want to dismiss?"));
    }
  };

  const handleRegisterDog = async (e) => {
    e.preventDefault();
    console.log("form submission");

    //validate the fields

    // Validation checks
    const namePattern = /^[A-Za-z]+$/; // Only letters
    const agePattern = /^\d+$/; // Only digits
    const weightPattern = /^\d+(\.\d{1,2})?$/;

    if (!namePattern.test(dog_name)) {
      // Invalid name
      alert("Please enter a valid dog name (letters only).");
      return;
    }

    if (!agePattern.test(dog_age)) {
      // Invalid age
      alert("Please enter a valid dog age (whole number only).");
      return;
    }

    if (!weightPattern.test(dog_weight)) {
      // Invalid weight
      alert(
        "Please enter a valid dog weight (decimal with up to 2 decimal places)."
      );
      return;
    }

    //axios.post to create dog

    try {
      await axios
        .post(`/dog`, {
          userId: user._id,
          name: dog_name,
          age: dog_age,
          gender: dog_gender,
          weight: dog_weight,
          breedId: dog_breed,
        })
        .then(() => (window.location.href = `/dog_profile/${dog_name}`));
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////
  //   useEffect(() => {
  //     console.log("Name:" + dog_name);
  //   }, [dog_name]);

  //   useEffect(() => {
  //     console.log("Age:" + dog_age);
  //   }, [dog_age]);

  //   useEffect(() => {
  //     console.log("Weight:" + dog_weight);
  //   }, [dog_weight]);

  //   useEffect(() => {
  //     console.log("Gender:" + dog_gender);
  //   }, [dog_gender]);

  //   useEffect(() => {
  //     console.log("Breed_id:" + dog_breed);
  //   }, [dog_breed]);

  ///////////////////////////////////////////////////////////

  return (
    <>
      <div className="container">
        <div className="flash-card">
          <h2 className="dogRegisterTitle">Dog Registration</h2>
          <form>
            <div className="form-group">
              <label htmlFor="dogName" className="dogRegisterLabel">
                Dog Name:
              </label>
              <input
                type="text"
                id="dogName"
                name="dogName"
                className="inputFieldDogRegister constrainedWidth"
                value={dog_name}
                onChange={(e) => setDogName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dogAge" className="dogRegisterLabel">
                Dog Age:
              </label>
              <input
                type="number"
                id="dogAge"
                name="dogAge"
                min="1"
                max="50"
                className="inputFieldDogRegister constrainedWidth"
                value={dog_age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dogWeight" className="dogRegisterLabel">
                Dog Weight (kg):
              </label>
              <input
                className="inputFieldDogRegister constrainedWidth"
                type="number"
                id="dogWeight"
                name="dogWeight"
                step=".01"
                min="0"
                max="50"
                value={dog_weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dogGender" className="dogRegisterLabel">
                Dog Gender:
              </label>
              <select
                id="dogGender"
                name="dogGender"
                className="inputFieldDogRegister dogRegisterSelect"
                value={dog_gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value={true}>Male</option>
                <option value={false}>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dogBreed" className="dogRegisterLabel">
                Dog Breed:
              </label>

              <select
                className="inputFieldDogRegister dogRegisterSelect"
                id="dogBreed"
                name="dogBreed"
                value={dog_breed}
                onChange={(e) => {
                  setBreed(e.target.value);
                }}
              >
                {breedList.map((breed) => (
                  <option key={breed._id} value={breed._id}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="last-form-group">
              <button
                type="submit"
                className="dogRegisterSubmit"
                onClick={handleRegisterDog}
              >
                Register
              </button>
              <button className="cancelBtn" onClick={cancelAction}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
