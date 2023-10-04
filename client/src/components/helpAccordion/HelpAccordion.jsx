import React, { useState } from "react";
import "./helpAccordion.css";
export default function HelpAccordion({ sections }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  //   const togglePanel = (index) => {
  //     setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  //   };

  return (
    <div className="accordion-container">
      {sections.map((section, index) => (
        <div key={index}>
          <button
            onClick={() => setActiveIndex(index)}
            className="sectionButton"
          >
            {index + 1}.{section.title}
          </button>

          {activeIndex === index && (
            <div className="sectionDescription">
              <p className="sectionContent">{section.content}</p>
              <p className="sectionContent">{section.steps}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
