import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import SettingsView from "../views/SettingsView";
import {notificationToggle, readUserData, updatePlantData, useAuth} from "../firebaseModel";

function SettingsPresenter() {
  let {plantName} = useParams();
  const {user} = useAuth();
  const [wateringType, setWateringType] = useState(" ");
  const [interval, setInterval] = useState("");
  const [chosenType, setChosenType] = useState()
  const [chosenInt, setChosenInt] = useState();

  const handleNotificationToggle = async (event) => {
    const toggleValue = event.target.checked;
    await notificationToggle(user, toggleValue);
  };

  useEffect(() => {
    const path = `plants/${plantName}/settings`
    readUserData(user, path).then((data) => {
      if (data) {
        let type = data.type
        if (type === "Scheduled" && data.frequency) {
          setInterval(data.frequency)
        }
        setWateringType(type)

      }
    }).catch(err => console.error(err));
  }, [user])

  useEffect(() => {
    if (!chosenInt) return;
    const path = `plants/${plantName}/settings/`
    updateInterval(user, path, {frequency: parseInt(chosenInt)})
  }, [chosenInt, user])
  useEffect(() => {
    if (chosenType) {
      updateType(user, plantName, {type: chosenType})
    }
  })

  function updateInterval(user, path, data) {
    updatePlantData(user, path, data).then(() => {
      window.location.reload()
    })
  }

  function updateType(user, plantName, type) {
    updatePlantData(user, `/plants/${plantName}/settings`, type).then(() => window.location.reload())
  }

  function getInterval(interval) {
    switch (interval) {
      case 96:
        return "4 days"
      case 168:
        return "1 week"
      case 336:
        return "2 weeks"
      default:
        return ""
    }
  }

  return (
    <SettingsView interval={interval} intervalText={getInterval(interval)} setInterval={setChosenInt}
                  wateringType={wateringType} plantName={plantName}
                  user={user} handleNotificationToggle={handleNotificationToggle}
                  setWateringPreference={setChosenType}/>
  );
}

export default SettingsPresenter;
