import React from "react";
import {Link} from "react-router-dom";
import addPlantIcon from "../styling/images/plus-pot.png";
import Modal from "./Modal";

export default function PlantView({user, plants, Plant}) {

  function renderPlants({plants, Plant}) {
    let meas = 'measureData';
    let array = [];

    Object.keys(plants).map(name => {
      const plantData = plants[name];
      return array.push(
        <Plant
          className={name}
          key={name}
          data={plantData[meas]}
          name={name}
          watering={plantData.plantRecommendedVitals.watering}
          sunlight={plantData.plantRecommendedVitals.sunlight}
          productID={plantData.productID}
        />
      );
    });

    return array;
  }

  return (
    <>
      <h2>Your plants</h2>
      <div className={"all-plants"}>
        {plants && user && renderPlants({plants, Plant})}
        <div className={"addPlant"}>
          <Link to="/addNewPlant">
            {<img src={addPlantIcon} alt="Add Plant"/>}
          </Link>
        </div>
      </div>
    </>
  )
}
