import "./dogCaretaker.css";
import { Save } from "@mui/icons-material";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

export default function DogCaretaker({ dog, user, caretakerList }) {
  const [caretakerId, setCaretakerId] = useState(
    dog.guestId === undefined ? "" : dog.guestId
  );

  const handleCaretakerChange = (event) => {
    const selectedCaretakerId = event.target.value;
    setCaretakerId(selectedCaretakerId);
  };

  const handleCaretakerSave = async () => {
    try {
      await axios
        .put(`/dog/${dog._id}`, {
          guestId: caretakerId,
        })
        .then(
          alert(
            `Dog: ${dog.name} now have new guest caretaker (you may now refresh the page).`
          )
        );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="caretakerWrapper">
        <span className="paddedClass">{dog.name}</span>

        <select
          className="caretakerSelect"
          value={caretakerId}
          onChange={handleCaretakerChange}
        >
          <option value="">-- none --</option>
          {caretakerList.map((element) => (
            <option key={element._id} value={element._id}>
              {element.username}
            </option>
          ))}
        </select>
        <Save className="saveIcon" onClick={handleCaretakerSave} />
      </div>
    </>
  );
}
