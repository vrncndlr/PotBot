// import React, { useState } from 'react';
// import { searchPlants, fetchPlantDetails } from '../services/plantSource';
// import plantSource from '../services/plantSource';


// function PlantSearch() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [plants, setPlants] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState(null);

//   const handleSearch = async () => {
//     const results = await plantSource.searchPlants(searchTerm);
//     setPlants(results);
//   };

//   const handleSelectPlant = async (plantId) => {
//     const plantDetails = await plantSource.fetchPlantDetails(plantId);
//     setSelectedPlant(plantDetails);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Search for a plant"
//       />
//       <button onClick={handleSearch}>Search</button>

//       {plants.map((plant) => (
//         <div key={plant.id} onClick={() => handleSelectPlant(plant.id)}>
//           {plant.common_name}
//         </div>
//       ))}

//       {selectedPlant && (
//         <div>
//           <img src={selectedPlant.default_image.regular_url} alt={selectedPlant.common_name} />
//           <div>Watering: {selectedPlant.watering}</div>
//           <div>Sunlight: {selectedPlant.sunlight.join(', ')}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PlantSearch;


// import React, { useState, useEffect } from 'react';
// import plantSource from '../services/plantSource';

// const PlantDetails = ({ commonName }) => {
//   const [plantDetails, setPlantDetails] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const plantId = await plantSource.searchPlantByCommonName(commonName);
//       if (plantId) {
//         const details = await plantSource.fetchPlantDetails(plantId);
//         setPlantDetails(details);
//       } else {
//         setPlantDetails(null);
//       }
//     })();
//   }, [commonName]);

//   return (
//     <div>
//       {plantDetails ? (
//         <pre>{JSON.stringify(plantDetails, null, 2)}</pre>
//       ) : (
//         <p>No plant found with common name: {commonName}</p>
//       )}
//     </div>
//   );
// };

// export default PlantDetails;
