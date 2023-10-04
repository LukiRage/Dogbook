import "./activityRecord.css";
import { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router";

export default function ActivityRecord({ object, index }) {
  const formattedDate = new Date(object.createdAt).toLocaleDateString();

  const [activityList, setActivityList] = useState([]); //lista aktywności z systemu wraz z identyfikatorami
  const [selectActivity, setSelectActivity] = useState(object?._id);
  const [activityMinsSpent, setActivityMinsSpent] = useState(object.mins_spent);
  const [editMode, toggleEditMode] = useState(false);
  const [dog, setDog] = useState({});
  const dogname = useParams().dogname;

  const [deleteActivityConfirmation, setDeleteActivityConfirmation] =
    useState(false);

  useEffect(() => {
    if (deleteActivityConfirmation) {
      const performDeleteAction = async () => {
        try {
          const result = await axios.delete(
            `/dog/activity/${dog._id}/${dog.activities[index]._id}`
          );
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };
      performDeleteAction();
    }
  }, [deleteActivityConfirmation]);

  //get the list of the activities in the system
  useEffect(() => {
    const getActivitiesAll = async () => {
      const result = await axios.get("/activity/all/activities");
      setActivityList(result.data);
    };
    getActivitiesAll();
  }, []);

  useEffect(() => {
    if (dogname) {
      const fetchDog = async () => {
        const res = await axios.get(`/dog?dogName=${dogname}`);
        setDog(res.data);
      };

      fetchDog();
    }
  }, [dogname]);

  //editActivityHandler
  const handleEditActivityRecordToggle = () => {
    toggleEditMode(!editMode);
  };

  const minsSpentPAttern = /^\d+$/; // Only digits
  const handleEditActivityRecord = async () => {
    if (!minsSpentPAttern.test(activityMinsSpent)) {
      alert("Invalid mins count!");
    } else {
      toggleEditMode(!editMode);
      try {
        const result = await axios.put(
          `/dog/activity/${dog._id}/${dog.activities[index]._id}`,
          {
            activityId: selectActivity,
            mins_spent: activityMinsSpent,
          }
        );
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteActivityRecord = async () => {
    setDeleteActivityConfirmation(
      window.confirm("Do you really want to delete this record?")
    );
  };

  return (
    <>
      {!editMode && (
        <tr>
          <td>
            <span className="spanNowrap">
              <span className="grayedText">Minutes spent: </span>
              {object.mins_spent}
            </span>
            <br />
            <span className="spanNowrap">
              <span className="grayedText">Date: </span>
              {formattedDate}
            </span>
          </td>
          <td className="textCenter">{object.name}</td>
          <td>
            <span className="spanNowrap">
              <span className="grayedText">Kcal per minute: </span>
              {object.kcal_per_minute}
              <br />
            </span>
            <span className="spanNowrap">
              <span className="grayedText">Distance per minute: </span>
              {object.distance_per_minute}
            </span>
          </td>
          <td>
            <Edit
              className="recordControl"
              onClick={handleEditActivityRecordToggle}
            />
            <Delete
              className="recordControl"
              onClick={handleDeleteActivityRecord}
            />
          </td>
        </tr>
      )}
      {editMode && (
        <tr>
          <td>
            <span className="dateEdit">{formattedDate}</span>
          </td>
          <td>
            <span className="minsSpent">Mins spent:</span>
            <input
              type="text"
              id="activityMinsSpent"
              className="activityMinsSpent"
              value={activityMinsSpent}
              onChange={(e) => setActivityMinsSpent(e.target.value)}
            />
          </td>
          <td>
            <span className="grayText">Activity type:</span>
            <select
              value={selectActivity}
              className="acivitySelect"
              onChange={(e) => {
                setSelectActivity(e.target.value);
              }}
            >
              <option value="">Select an option</option>
              {activityList.map((activity) => (
                <option key={activity._id} value={activity._id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </td>
          <td>
            <Edit
              className="recordControl"
              onClick={handleEditActivityRecord}
            />
          </td>
        </tr>
      )}
    </>
  );
}
