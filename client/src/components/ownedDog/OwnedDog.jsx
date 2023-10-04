import "./ownedDog.css";
import { Link } from "react-router-dom";

export default function OwnedDog({ dog }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="sidebarDog">
      <Link
        to={"/dog_profile/" + dog.name}
        style={{ textDecoration: "none" }}
        className="linkClass"
      >
        <img
          src={dog.image ? PF + dog.image : PF + "noDogAvatar.png"} //
          alt=""
          className="sidebarDogImg"
        />
        <span className="sidebarDogName">{dog.name}</span>
      </Link>
    </li>
  );
}
