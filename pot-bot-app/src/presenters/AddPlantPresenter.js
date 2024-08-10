import {addNewPlant, useAuth} from '../firebaseModel';
import AddPlantView from '../views/AddPlantView';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AddPlantPresenter() {
  const {user} = useAuth();
  const navigate = useNavigate()
  const [addPlant, setPlant] = useState(false)
  const [personalPlantList, setPersonalPlantList] = useState();
  const addPlantToPersonalList = (plant) => {
    setPersonalPlantList(plant);
    setPlant(true)
  };
  useEffect(() => {
    //function för att extrahera den data vi behöver
    if (addPlant) {
      //TODO: Maybe add so you can chose your plant name
      addNewPlant(user, personalPlantList.common_name, {
        image: personalPlantList.default_image.original_url,
        sunlight: personalPlantList.sunlight,
        watering: personalPlantList.watering,
        temperature: '15'
      }).then(() => {
        setPersonalPlantList([])
        setPlant(false)
        navigate("/home")

      }).catch(err => console.error(err.message))
    }
  }, [personalPlantList, user]);


  return (
    // <div className='addPlant module'>
      <AddPlantView addPlantToPersonalList={addPlantToPersonalList}/>
    // </div>
  );
}
