import "./behaviourRecord.css";
import { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router";

export default function BehaviourRecord({ object, index }) {
  const formattedDate = new Date(object.createdAt).toLocaleDateString();

  const [behaviourTitle, setBehaviourTitle] = useState(object.name);
  const [behaviourDescription, setBehaviourDescription] = useState(
    object.description
  );
  const [editMode, toggleEditMode] = useState(false);
  const [dog, setDog] = useState({});
  const dogname = useParams().dogname;

  const [deleteBehaviourConfirmation, setDeleteBehaviourConfirmation] =
    useState(false);
  const [updateBehaviourConfirmation, setUpdateBehaviourConfirmation] =
    useState(false);

  useEffect(() => {
    if (deleteBehaviourConfirmation) {
      const performDeleteAction = async () => {
        try {
          const result = await axios.delete(
            `/dog/behaviour/${dog._id}/${dog.behaviours[index]._id}`
          );
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };
      performDeleteAction();
    }
  }, [deleteBehaviourConfirmation]);

  useEffect(() => {
    if (updateBehaviourConfirmation) {
      const performUpdateAction = async () => {
        try {
          const result = await axios.put(
            `/dog/behaviour/${dog._id}/${dog.behaviours[index]._id}`,
            {
              name: behaviourTitle,
              description: behaviourDescription,
            }
          );
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };

      performUpdateAction();
    }
  }, [updateBehaviourConfirmation]);

  useEffect(() => {
    if (dogname) {
      const fetchDog = async () => {
        const res = await axios.get(`/dog?dogName=${dogname}`);
        setDog(res.data);
      };

      fetchDog();
    }
  }, [dogname]);

  const handleEditBehaviourRecordToggle = () => {
    toggleEditMode(!editMode);
  };

  const titlePattern = /^[a-zA-Z\s]*$/;
  const descriptionPattern = /^[a-zA-Z0-9\s\.,?!'"-]*$/;
  const handleEditBehaviourRecord = async () => {
    if (
      !titlePattern.test(behaviourTitle) ||
      !descriptionPattern.test(behaviourDescription)
    ) {
      alert(
        "Invalid text input! You can only use letters, numbers and interpunction"
      );
    } else {
      if (
        object.name !== behaviourTitle ||
        object.description !== behaviourDescription
      ) {
        //jeżeli się zmieniło
        setUpdateBehaviourConfirmation(
          window.confirm("Do you really want to update this record?")
        );
      } else {
        toggleEditMode(!editMode);
      }

      //
    }
  };

  const handleDeleteBehaviourRecord = async () => {
    //console.log("Delete");
    setDeleteBehaviourConfirmation(
      window.confirm("Do you really want to delete this record?")
    );
  };

  return (
    <>
      {!editMode && (
        <tr>
          <td>
            <span className="behaviourDate">{formattedDate}</span>
          </td>
          <td className="textCenter">
            <span className="behaviourName">{object.name}</span>
          </td>
          <td>
            <span className="behaviourDescription">{object.description}</span>
          </td>
          <td>
            <Edit
              className="recordControl"
              onClick={handleEditBehaviourRecordToggle}
            />
            <Delete
              className="recordControl"
              onClick={handleDeleteBehaviourRecord}
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
            <span className="grayText">Name:</span>
            <input
              type="text"
              className="behaviourEditTitle"
              value={behaviourTitle}
              onChange={(e) => setBehaviourTitle(e.target.value)}
            />
          </td>
          <td>
            <span className="grayText">Description:</span>
            <textarea
              className="behaviourEditDescription"
              value={behaviourDescription}
              onChange={(e) => setBehaviourDescription(e.target.value)}
            />
          </td>
          <td>
            <Edit
              className="recordControl"
              onClick={handleEditBehaviourRecord}
            />
          </td>
        </tr>
      )}
    </>
  );
}
