import "./breedAdvantage.css";
import { useState } from "react";

export default function BreedAdvantage({ advantage, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <li
        key={index}
        className="greyedTitle"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span id="title">{advantage.name}</span>
        <span id="description" className={isHovered ? "dispBlock" : "dispNone"}>
          - {advantage.description}
        </span>
      </li>
    </>
  );
}
