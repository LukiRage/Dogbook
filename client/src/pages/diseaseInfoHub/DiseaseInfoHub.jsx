import "./diseaseInfoHub.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";

export default function DiseaseInfoHub() {
  const [diseaseList, setDiseaseList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const result = await axios.get("/disease/all/diseases");
        setDiseaseList(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDiseaseData();
  }, []);

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="diseaseHub">
        <div className="diseaseHubWrapper">
          <div className="pageInfo">
            <button className="homeButton" onClick={handleHome}>
              <ArrowBack fontSize="large" />
              <span className="homeButtonText">Go to home page</span>
            </button>
            <h1 className="pageInfoTitle">Disease Information Hub</h1>
            <span className="pageInfoDescripton">
              This page contains all possible dog diseases that are defined
              within Dogbook service. If you are not satisfied with diversity of
              options try to reach Dogbook admins to create more diseases.
            </span>
          </div>
          {/* 
          {JSON.stringify(diseaseList)} */}

          <div className="accordion-container">
            {diseaseList.map((section, index) => (
              <div key={index}>
                <button
                  onClick={() => setActiveIndex(index)}
                  className="sectionButton"
                >
                  {index + 1}.{section.name}
                </button>

                {activeIndex === index && (
                  <div className="sectionDescription">
                    <p className="sectionContent">{section.description}</p>
                    <p className="sectionContent">
                      Symptoms:
                      <ul>
                        {section.symptoms.map((symptom, symptomIndex) => (
                          <li key={symptomIndex}>{symptom}</li>
                        ))}
                      </ul>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
