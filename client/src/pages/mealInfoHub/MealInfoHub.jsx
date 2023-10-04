import "./mealInfoHub.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";

export default function MealInfoHub() {
  const [mealList, setMealList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dangerMealIndex, setDangerMealIndex] = useState(-1);

  const [firstActiveSection, setFirstActiveSection] = useState(false);
  const [secondActiveSection, setSecondActiveSection] = useState(false);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const result = await axios.get("/meal/all/meals");
        setMealList(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMealData();
  }, []);

  //   useEffect(() => {
  //     console.log(JSON.stringify(mealList));
  //   }, [mealList]);

  const handleHome = () => {
    window.location.href = "/";
  };

  const dangerMealsList = [
    {
      name: "Chocolate",
      description:
        "Contains theobromine, which is toxic to dogs and can cause serious health issues or even be fatal.",
    },
    {
      name: "Grapes and Raisins",
      description: "Can lead to kidney failure in some dogs.",
    },
    {
      name: "Onions and Garlic",
      description: "Both can damage a dog's red blood cells and cause anemia.",
    },
    {
      name: "Avocado",
      description: "Contains persin, which can be toxic to dogs.",
    },
    {
      name: "Alcohol",
      description:
        "Even small amounts can be dangerous and cause intoxication, leading to vomiting, diarrhea, and even death.",
    },
    {
      name: "Bones",
      description:
        "Cooked bones can splinter and cause choking or internal injuries.",
    },
    {
      name: "Caffeine",
      description:
        "Found in coffee, tea, and some sodas, it's toxic to dogs and can cause restlessness, rapid heart rate, and seizures.",
    },
    {
      name: "Xylitol",
      description:
        "A sugar substitute often found in sugar-free gum, candy, and baked goods, it can cause a rapid release of insulin in dogs, leading to hypoglycemia.",
    },
    {
      name: "Macadamia Nuts",
      description: "Can cause muscle tremors, weakness, and vomiting.",
    },
    {
      name: "Cherries",
      description: "The pits contain cyanide, which is toxic to dogs.",
    },
    {
      name: "Mushrooms",
      description:
        "Some types of mushrooms can be toxic to dogs, potentially causing organ failure.",
    },
    {
      name: "High-Fat Foods",
      description:
        "Foods like bacon, fried foods, and fatty meats can lead to pancreatitis in dogs.",
    },
    {
      name: "Dairy Products",
      description:
        "Many dogs are lactose intolerant and may experience digestive upset if they consume dairy.",
    },
    {
      name: "Spices",
      description:
        "Certain spices like nutmeg can be toxic to dogs in large amounts.",
    },
    {
      name: "Salty Foods",
      description:
        "Excessive salt intake can lead to sodium ion poisoning in dogs, which can be fatal.",
    },
    {
      name: "Raw Eggs",
      description:
        "They may contain salmonella and can interfere with biotin absorption.",
    },
    {
      name: "Raw Fish",
      description: "May contain parasites that can be harmful to dogs.",
    },
    {
      name: "Fruit Pits and Seeds",
      description:
        "The pits and seeds of fruits like apples and peaches contain cyanide and can be dangerous.",
    },
    {
      name: "Sweets and Sugary Foods",
      description:
        "High sugar intake can lead to obesity, dental issues, and diabetes in dogs.",
    },
    {
      name: "Candies and Chewing Gum",
      description: "Often contain xylitol, which is toxic to dogs.",
    },
    {
      name: "Hops",
      description:
        "Used in brewing beer, hops can cause malignant hyperthermia in dogs.",
    },
    {
      name: "Human Medications",
      description:
        "Many human medications can be toxic to dogs, so never give them any without consulting a veterinarian.",
    },
    {
      name: "Almonds",
      description:
        "They can block the esophagus or tear the windpipe if not chewed properly. They are difficult for dogs to digest and can cause stomach upset or blockages.",
    },
    {
      name: "Corn on the Cob",
      description: "The cob can cause intestinal blockages if ingested.",
    },
  ];

  return (
    <>
      <div className="mealHub">
        <div className="mealHubWrapper">
          <div className="pageInfo">
            <button className="homeButton" onClick={handleHome}>
              <ArrowBack fontSize="large" />
              <span className="homeButtonText">Go to home page</span>
            </button>
            <h1 className="pageInfoTitle">Meal Information Hub</h1>
            <span className="pageInfoDescripton">
              This page contains all possible dog food that are defined within
              Dogbook service. If you are not satisfied with diversity of
              options try to reach Dogbook admins to create more meals.
            </span>
          </div>

          {/* {JSON.stringify(mealList)} */}

          <div className="accordion-container">
            <div>
              <button
                onClick={() => setFirstActiveSection(!firstActiveSection)}
                className="sectionButton mainSectionButton"
              >
                See this section ...
              </button>
            </div>

            {firstActiveSection && (
              <>
                {mealList.map((section, index) => (
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
                          Water percentage: {section.water_percentage}
                        </p>
                        <p className="sectionContent">
                          Carbohydrates percentage:{" "}
                          {section.carbohydrates_percentage}
                        </p>
                        <p className="sectionContent">
                          Protein percentage: {section.protein_percentage}
                        </p>
                        <p className="sectionContent">
                          Fat percentage: {section.fat_percentage}
                        </p>
                        <p className="sectionContent">
                          Vitamins:{" "}
                          {section.vitamins.map(
                            (vitamin, vitaminIndex) => vitamin + ","
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Danger meal section */}
          <div className="pageInfo">
            <h1 className="pageInfoTitle dangerMealsTitle">
              Dangerous meals to avoid
            </h1>
            <span className="pageInfoDescripton">
              This page contains all possible dog food that are defined within
              Dogbook service. If you are not satisfied with diversity of
              options try to reach Dogbook admins to create more meals.
            </span>
          </div>

          <div className="accordion-container">
            <div>
              <button
                onClick={() => setSecondActiveSection(!secondActiveSection)}
                className="sectionButton mainSectionButton"
              >
                See this section ...
              </button>
            </div>

            {secondActiveSection && (
              <>
                {dangerMealsList.map((section, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setDangerMealIndex(index)}
                      className="sectionButton"
                    >
                      {index + 1}.{section.name}
                    </button>

                    {dangerMealIndex === index && (
                      <div className="sectionDescription">
                        <p className="sectionContent">{section.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
