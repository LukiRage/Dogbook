import "./mealRecord.css";
import { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router";

export default function MealRecord({ object, index }) {
  const formattedDate = new Date(object.createdAt).toLocaleDateString();

  const [mealList, setMealList] = useState([]); //lista posiłków z systemu wraz z identyfikatorami
  const [selectMeal, setSelectMeal] = useState(object?._id);
  const [editMode, toggleEditMode] = useState(false);
  const [dog, setDog] = useState({});
  const dogname = useParams().dogname;

  const [deleteMealConfirmation, setDeleteMealConfirmation] = useState(false);

  useEffect(() => {
    if (deleteMealConfirmation) {
      const performDeleteAction = async () => {
        try {
          const result = await axios.delete(
            `/dog/meal/${dog._id}/${dog.meals[index]._id}`
          );
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };
      performDeleteAction();
    }
  }, [deleteMealConfirmation]);

  //get the list of the meals in the system
  useEffect(() => {
    const getMealsAll = async () => {
      const result = await axios.get("/meal/all/meals");
      setMealList(result.data);
    };
    getMealsAll();
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

  //editMealHandler
  const handleEditMealRecordToggle = () => {
    toggleEditMode(!editMode);
  };

  const handleEditMealRecord = async () => {
    toggleEditMode(!editMode);

    //update request ...write
    try {
      const result = await axios.put(
        `/dog/meal/${dog._id}/${dog.meals[index]._id}`,
        {
          mealId: selectMeal,
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  //deleteMealHandler
  const handleDeleteMealRecord = async () => {
    setDeleteMealConfirmation(
      window.confirm("Do you really want to delete this record?")
    );
  };

  return (
    <>
      {!editMode && (
        <tr>
          <td>
            <span className="grayText">{formattedDate}</span>
          </td>
          <td>
            <span className="grayText">Name: </span>
            <br />
            {object.name}
            <br />

            <span className="grayText">Description: </span>
            <br />
            {object.description}
          </td>
          <td>
            <span className="spanNowrap">
              <span className="grayText">Water: </span>
              {object.water_percentage}%
            </span>
            <br />
            <span className="spanNowrap">
              <span className="grayText">Carbohydrates: </span>
              {object.carbohydrates_percentage}%
            </span>
            <br />
            <span className="spanNowrap">
              <span className="grayText">Protein: </span>
              {object.protein_percentage}%
            </span>
            <br />

            <span className="spanNowrap">
              <span className="grayText">Fat: </span>
              {object.fat_percentage}%
            </span>
            <br />
            <span className="spanNowrap">
              <span className="grayText">Vitamins: </span>
              {/* /{object.vitamins} */}
              {object.vitamins.map((vitamin) => {
                return vitamin + ",";
              })}
            </span>
          </td>
          <td>
            <Edit
              className="recordControl"
              onClick={handleEditMealRecordToggle}
            />
            <Delete
              className="recordControl"
              onClick={handleDeleteMealRecord}
            />
          </td>
        </tr>
      )}

      {editMode && (
        <tr>
          <td>
            <span className="grayText">{formattedDate}</span>
          </td>
          <td>
            <select
              value={selectMeal}
              onChange={(e) => {
                setSelectMeal(e.target.value);
              }}
              className="mealSelect"
            >
              <option value="">Select an option</option>
              {mealList.map((meal) => (
                <option key={meal._id} value={meal._id}>
                  {meal.name}
                </option>
              ))}
            </select>
          </td>
          <td>
            <Edit className="recordControl" onClick={handleEditMealRecord} />
          </td>
        </tr>
      )}
    </>
  );
}
