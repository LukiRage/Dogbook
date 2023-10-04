import "./diseaseRecord.css";
import { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router";

export default function DiseaseRecord({ object, index }) {
  const formattedDate = new Date(object.createdAt).toLocaleDateString();
  const [diseaseList, setDiseaseList] = useState([]); //lista chorób z systemu wraz z identyfikatorami
  const [selectDisease, setSelectDisease] = useState(object?._id);
  const [diseaseDayCount, setDiseaseDayCount] = useState(object.day_count);
  const [editMode, toggleEditMode] = useState(false);
  const [dog, setDog] = useState({});
  const dogname = useParams().dogname;

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (deleteConfirmation) {
      const performDeleteAction = async () => {
        try {
          const result = await axios.delete(
            `/dog/disease/${dog._id}/${dog.diseases[index]._id}`
          );
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };
      performDeleteAction();
    }
  }, [deleteConfirmation]);

  //get the list of the diseases in the system
  useEffect(() => {
    const getDiseasesAll = async () => {
      const result = await axios.get("/disease/all/diseases");
      setDiseaseList(result.data);
    };
    getDiseasesAll();
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

  //editSymptomHandler
  const handleEditDiseaseRecordToggle = () => {
    toggleEditMode(!editMode);
  };

  const dayCountPattern = /^\d+$/; // Only digits
  const handleEditDiseaseRecord = async () => {
    if (!dayCountPattern.test(diseaseDayCount)) {
      alert("Invalid day count!");
    } else {
      toggleEditMode(!editMode);
      try {
        const result = await axios.put(
          `/dog/disease/${dog._id}/${dog.diseases[index]._id}`,
          {
            diseaseId: selectDisease,
            day_count: diseaseDayCount,
          }
        );
        //console.log(result.data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteDiseaseRecord = async () => {
    //console.log("Delete:" + object._id);
    console.log("Confirm");
    setDeleteConfirmation(
      window.confirm("Do you really want to delete this record?")
    );
  };

  return (
    <>
      {!editMode && (
        <tr>
          <td>
            <span className="spanNowrap">Day count: {object.day_count}</span>
            <br />
            <span className="grayDate">{formattedDate}</span>
          </td>
          <td>
            <span className="grayText">Name:</span> <br /> {object.name}
            <br />
            <span className="grayText">Description: </span> <br />
            {object.description}
          </td>
          <td>
            <span className="grayText">Symptoms: </span>
            <ul>
              {object.symptoms.map((symptom, index) => (
                <li key={index}>{symptom},</li>
              ))}
            </ul>
          </td>
          <td>
            <Edit onClick={handleEditDiseaseRecordToggle} />
            <Delete onClick={handleDeleteDiseaseRecord} />
          </td>
        </tr>
      )}
      {editMode && (
        <tr>
          <td>
            <span>{formattedDate}</span>
          </td>
          <td>
            <span>Day count:</span>
            <br />
            <input
              type="text"
              id="diseaseDayCount"
              className="diseaseDayCount"
              value={diseaseDayCount}
              onChange={(e) => setDiseaseDayCount(e.target.value)}
            />
          </td>

          <td>
            <span>Disease:</span>
            <br />
            <select
              value={selectDisease}
              onChange={(e) => {
                setSelectDisease(e.target.value);
                //console.log(selectDisease);
              }}
              className="diseaseSelect"
            >
              {diseaseList.map((disease) => (
                <option key={disease._id} value={disease._id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </td>
          <td>
            <Edit className="recordControl" onClick={handleEditDiseaseRecord} />
          </td>
        </tr>
      )}
    </>
  );
}
