import ActivityRecord from "../activityRecord/ActivityRecord";
import BehaviourRecord from "../behaviourRecord/BehaviourRecord";
import DiseaseRecord from "../diseaseRecord/DiseaseRecord";
import MealRecord from "../mealRecord/MealRecord";
import { Add, Save } from "@mui/icons-material";
import "./dogFeed.css";
import {
  Sick,
  Restaurant,
  FitnessCenter,
  Psychology,
} from "@mui/icons-material";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

export default function DogFeed({ dog_id }) {
  const [selectedPanel, setSelectedPanel] = useState(0);

  const [disease, setDisease] = useState([]);
  const [meal, setMeal] = useState([]);
  const [activity, setActiviy] = useState([]);
  const [behaviour, setBehaviour] = useState([]);

  //varibles for creating new records (disease/meal/activity/behaviour)
  const [addSectionActive, setAddSectionActive] = useState(false);
  const [diseaseList, setDiseaseList] = useState([]);
  const [selectDisease, setSelectDisease] = useState();
  const [diseaseDayCount, setDiseaseDayCount] = useState(1);

  const [mealList, setMealList] = useState([]);
  const [selectMeal, setSelectMeal] = useState();

  const [activityList, setActivityList] = useState([]);
  const [minsSpent, setMinsSpent] = useState(1);
  const [selectActivity, setSelectActivity] = useState();

  const [behaviourName, setBehaviourName] = useState();
  const [behaviourDescription, setBehaviourDescription] = useState();

  //patterns for validation
  const numberPattern = /^\d+$/; // Only digits
  const titlePattern = /^[a-zA-Z\s]*$/;
  const descriptionPattern = /^[a-zA-Z0-9\s\.,?!'"-]*$/;

  //handler for diseases (click-event)
  const handleDiseasePanel = async () => {
    try {
      setSelectedPanel(1);

      //change button color
      document.getElementById("sick").style.color = "#1877f2";
      document.getElementById("sick-text").style.color = "#1877f2";

      //change meal - gray color
      document.getElementById("meal").style.color = "rgb(110, 110, 110)";
      document.getElementById("meal-text").style.color = "rgb(110, 110, 110)";

      //change activity - gray color
      document.getElementById("activity").style.color = "rgb(110, 110, 110)";
      document.getElementById("activity-text").style.color =
        "rgb(110, 110, 110)";

      //change behaviour - gray color
      document.getElementById("behaviour").style.color = "rgb(110, 110, 110)";
      document.getElementById("behaviour-text").style.color =
        "rgb(110, 110, 110)";

      document.getElementById("infoPane").style.display = "none";
    } catch (err) {
      console.log(err);
    }
  };

  //handler for meals (click-event)
  const handleMealPanel = async () => {
    try {
      setSelectedPanel(2);

      //change button color
      document.getElementById("meal").style.color = "#1877f2";
      document.getElementById("meal-text").style.color = "#1877f2";

      //change sick button color - gray
      document.getElementById("sick").style.color = "rgb(110, 110, 110)";
      document.getElementById("sick-text").style.color = "rgb(110, 110, 110)";

      //change activity - gray color
      document.getElementById("activity").style.color = "rgb(110, 110, 110)";
      document.getElementById("activity-text").style.color =
        "rgb(110, 110, 110)";

      //change behaviour - gray color
      document.getElementById("behaviour").style.color = "rgb(110, 110, 110)";
      document.getElementById("behaviour-text").style.color =
        "rgb(110, 110, 110)";
      document.getElementById("infoPane").style.display = "none";
    } catch (err) {
      console.log(err);
    }
  };

  //handler for activities (click-event)
  const handleActivityPanel = async () => {
    try {
      setSelectedPanel(3);

      //change button color
      document.getElementById("activity").style.color = "#1877f2";
      document.getElementById("activity-text").style.color = "#1877f2";

      //change sick button color - gray
      document.getElementById("sick").style.color = "rgb(110, 110, 110)";
      document.getElementById("sick-text").style.color = "rgb(110, 110, 110)";

      //change meal - gray color
      document.getElementById("meal").style.color = "rgb(110, 110, 110)";
      document.getElementById("meal-text").style.color = "rgb(110, 110, 110)";

      //change behaviour - gray color
      document.getElementById("behaviour").style.color = "rgb(110, 110, 110)";
      document.getElementById("behaviour-text").style.color =
        "rgb(110, 110, 110)";

      document.getElementById("infoPane").style.display = "none";
    } catch (err) {
      console.log(err);
    }
  };

  //handler for behaviour (click-event)
  const handleBehaviourPanel = async () => {
    try {
      setSelectedPanel(4);

      //change button color
      document.getElementById("behaviour").style.color = "#1877f2";
      document.getElementById("behaviour-text").style.color = "#1877f2";

      //change sick button color - gray
      document.getElementById("sick").style.color = "rgb(110, 110, 110)";
      document.getElementById("sick-text").style.color = "rgb(110, 110, 110)";

      //change meal - gray color
      document.getElementById("meal").style.color = "rgb(110, 110, 110)";
      document.getElementById("meal-text").style.color = "rgb(110, 110, 110)";

      //change activity - gray color
      document.getElementById("activity").style.color = "rgb(110, 110, 110)";
      document.getElementById("activity-text").style.color =
        "rgb(110, 110, 110)";

      document.getElementById("infoPane").style.display = "none";
    } catch (err) {
      console.log(err);
    }
  };

  //use effect that is dependant on variable
  useEffect(() => {
    //console.log("Selected panel:" + selectedPanel);
    if (dog_id) {
      switch (selectedPanel) {
        case 1:
          //call for map of diseases
          const fetchDiseaseData = async () => {
            try {
              const diseaseList = await axios.get("/dog/disease/" + dog_id);
              setDisease(diseaseList.data);
            } catch (err) {
              console.log(err);
            }
          };
          fetchDiseaseData();

          setMeal([]);
          setActiviy([]);
          setBehaviour([]);
          break;
        case 2:
          //call for map of meals
          const fetchMealData = async () => {
            try {
              const mealList = await axios.get("/dog/meal/" + dog_id);
              setMeal(mealList.data);
            } catch (err) {
              console.log(err);
            }
          };
          fetchMealData();

          setDisease([]);
          setActiviy([]);
          setBehaviour([]);

          break;
        case 3:
          //call for map of activity
          const fetchActivityData = async () => {
            try {
              const activityList = await axios.get("/dog/activity/" + dog_id);
              setActiviy(activityList.data);
            } catch (err) {
              console.log(err);
            }
          };
          fetchActivityData();

          setDisease([]);
          setMeal([]);
          setBehaviour([]);

          break;
        case 4:
          //call for map of behaviour
          const fetchBehaviourData = async () => {
            try {
              const behaviourList = await axios.get("/dog/behaviour/" + dog_id);
              setBehaviour(behaviourList.data);
            } catch (err) {
              console.log(err);
            }
          };
          fetchBehaviourData();

          setDisease([]);
          setMeal([]);
          setActiviy([]);

          break;
        default:
          setDisease([]);
          setMeal([]);
          setActiviy([]);
          setBehaviour([]);

          break;
      }
    }
  }, [selectedPanel]);

  //add element to the disease/meal/activity/behaviour (based on "selectedPanel" it will send request to the specific element)
  const handleAddElement = () => {
    console.log("Add section toggled");
    setAddSectionActive(!addSectionActive);
  };

  const handleSendAddRequest = () => {
    switch (selectedPanel) {
      case 1:
        addNewDisease();
        break;
      case 2:
        addNewMeal();
        break;
      case 3:
        addNewActivity();
        break;
      case 4:
        addNewBehaviour();
        break;
    }
  };

  const addNewDisease = async () => {
    console.log("NewDisease");

    if (selectDisease === undefined) {
      console.log("Pusty");
      alert("Select a Disease type");
    } else {
      if (!numberPattern.test(diseaseDayCount)) {
        alert("Day count should be numeric value!");
      } else {
        try {
          //axios post request with body to save new disease
          axios
            .post(`/dog/disease/${dog_id}`, {
              diseaseId: selectDisease,
              day_count: diseaseDayCount,
            })
            //.then((response) => {
            //console.log(response.data);
            //})
            .then(() => {
              window.location.reload();
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const addNewMeal = async () => {
    console.log("NewMeal");
    if (selectMeal === undefined) {
      console.log("Pusty");
      alert("Select a Meal type");
    } else {
      try {
        axios
          .post(`/dog/meal/${dog_id}`, {
            mealId: selectMeal,
          })
          .then((response) => {
            //console.log(response.data);
          })
          .then(() => {
            window.location.reload();
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addNewActivity = async () => {
    console.log("NewActivity");
    if (selectActivity === undefined) {
      console.log("Pusty");
      alert("Select a Activity type");
    } else {
      if (!numberPattern.test(minsSpent)) {
        alert("Minutes count should be numeric value!");
      } else {
        try {
          axios
            .post(`/dog/activity/${dog_id}`, {
              mins_spent: minsSpent,
              activityId: selectActivity,
            })
            .then((response) => {
              //console.log(response.data);
            })
            .then(() => {
              window.location.reload();
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const addNewBehaviour = async () => {
    console.log("NewBehaviour");
    if (!titlePattern.test(behaviourName)) {
      alert("The title shoud consiste only by words (no numbers allowed)!");
    } else if (!descriptionPattern.test(behaviourDescription)) {
      alert("The Description should consist only by words and numbers!");
    } else {
      try {
        axios
          .post(`/dog/behaviour/${dog_id}`, {
            name: behaviourName,
            description: behaviourDescription,
          })
          .then((response) => {
            //console.log(response.data);
          })
          .then(() => {
            window.location.reload();
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const getDiseasesAll = async () => {
      const result = await axios.get("/disease/all/diseases");
      setDiseaseList(result.data);
    };
    getDiseasesAll();
  }, []);

  useEffect(() => {
    const getMealsAll = async () => {
      const result = await axios.get("/meal/all/meals");
      setMealList(result.data);
    };
    getMealsAll();
  }, []);

  useEffect(() => {
    const getActivitiesAll = async () => {
      const result = await axios.get("/activity/all/activities");
      setActivityList(result.data);
    };
    getActivitiesAll();
  }, []);

  // useEffect(() => {
  //   console.log("panel:" + selectedPanel);
  // }, [selectedPanel]);

  // useEffect(() => {
  //   console.log("edit:" + addSectionActive);
  // }, [addSectionActive]);

  return (
    <div className="feed">
      <div className="infoPane" id="infoPane">
        <h1>Choose section</h1>
      </div>
      <div className="feedDogWrapper">
        {/* {(!username || username === user.username) && <Share />} */}

        <div className="dogFeedControls">
          <div className="dogFeedControl" onClick={handleDiseasePanel}>
            <Sick fontSize="large" className="iconButton" id="sick" />
            <span id="sick-text">Diseases</span>
          </div>
          <div className="dogFeedControl" onClick={handleMealPanel}>
            <Restaurant fontSize="large" className="iconButton" id="meal" />
            <span id="meal-text">Meals</span>
          </div>
          <div className="dogFeedControl" onClick={handleActivityPanel}>
            <FitnessCenter
              fontSize="large"
              className="iconButton"
              id="activity"
            />
            <span id="activity-text">Activity</span>
          </div>
          <div className="dogFeedControl" onClick={handleBehaviourPanel}>
            <Psychology
              fontSize="large"
              className="iconButton"
              id="behaviour"
            />
            <span id="behaviour-text">Behaviour</span>
          </div>
        </div>
        <hr className="hrSeperator" />
        <div className="componentContainer">
          {disease.length > 0 ? (
            <table>
              {/* render diseases */}
              {disease.length > 0
                ? disease.map((diseaseItem, index) => (
                    <DiseaseRecord
                      key={index}
                      object={diseaseItem}
                      index={index}
                    />
                  ))
                : ""}
            </table>
          ) : (
            ""
          )}

          {meal.length > 0 ? (
            <table>
              {/* render meals */}
              {meal.length > 0
                ? meal.map((mealItem, index) => (
                    <MealRecord key={index} object={mealItem} index={index} />
                  ))
                : ""}
            </table>
          ) : (
            ""
          )}

          {activity.length > 0 ? (
            <table>
              {/* render activities */}
              {activity.length > 0
                ? activity.map((activityItem, index) => (
                    <ActivityRecord
                      key={index}
                      object={activityItem}
                      index={index}
                    />
                  ))
                : ""}
            </table>
          ) : (
            ""
          )}

          {behaviour.length > 0 ? (
            <table>
              {/* render behaviours */}
              {behaviour.length > 0
                ? behaviour.map((behaviourItem, index) => (
                    <BehaviourRecord
                      key={index}
                      object={behaviourItem}
                      index={index}
                    />
                  ))
                : ""}
            </table>
          ) : (
            ""
          )}
        </div>

        <div className="addSection">
          <hr className="hrSeperator" />
          <div className="addButton" onClick={handleAddElement}>
            <span className="addTitle">Add new element ...</span>
            <Add />
            {/* <Save /> */}
          </div>
          <div
            className="addDiseaseDiv"
            style={{
              display:
                addSectionActive && selectedPanel == "1" ? "flex" : "none",
            }}
          >
            <span className="fieldDesc">Day count:</span>
            <input
              type="number"
              min="1"
              max="100"
              onChange={(e) => {
                setDiseaseDayCount(e.target.value);
              }}
              className="inputField"
            ></input>
            <span className="fieldDesc">Disease type:</span>
            <select
              onChange={(e) => {
                setSelectDisease(e.target.value);
              }}
              className="selectElement"
            >
              {diseaseList.map((disease) => (
                <option key={disease._id} value={disease._id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className="addMealDiv"
            style={{
              display:
                addSectionActive && selectedPanel == "2" ? "flex" : "none",
            }}
          >
            <span className="fieldDesc">Meal type:</span>
            <select
              onChange={(e) => {
                setSelectMeal(e.target.value);
              }}
              className="selectElement"
            >
              {mealList.map((meal) => (
                <option key={meal._id} value={meal._id}>
                  {meal.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className="addActivityDiv"
            style={{
              display:
                addSectionActive && selectedPanel == "3" ? "flex" : "none",
            }}
          >
            <span className="fieldDesc">Activity duration (minutes):</span>
            <input
              type="number"
              min="1"
              max="300"
              onChange={(e) => {
                setMinsSpent(e.target.value);
              }}
              className="inputField"
            ></input>
            <span className="fieldDesc">Activity type:</span>
            <select
              onChange={(e) => {
                setSelectActivity(e.target.value);
              }}
              className="selectElement"
            >
              {activityList.map((activity) => (
                <option key={activity._id} value={activity._id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className="addBehaviourDiv"
            style={{
              display:
                addSectionActive && selectedPanel == "4" ? "flex" : "none",
            }}
          >
            <span className="fieldDesc">Behaviour title:</span>
            <input
              type="text"
              onChange={(e) => {
                setBehaviourName(e.target.value);
              }}
              className="inputField"
            ></input>
            <span className="fieldDesc">Behaviour description:</span>
            <textarea
              onChange={(e) => {
                setBehaviourDescription(e.target.value);
              }}
              className="textareaField"
            ></textarea>
          </div>

          <div
            className="saveBtn"
            style={{
              display: addSectionActive ? "flex" : "none",
            }}
            onClick={handleSendAddRequest}
          >
            Save ...
            <Save />
          </div>
        </div>
      </div>
    </div>
  );
}
