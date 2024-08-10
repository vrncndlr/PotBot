import {disconnectPlant, readUserData, removePlant, setWateredTrue, useAuth} from "../firebaseModel";
import React, {useEffect, useState} from "react";
import PlantView from "../views/PlantView";
import {Link, useNavigate} from "react-router-dom";
import elephant from "../styling/images/elefant.jpg";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faCheckCircle,
  faCloud,
  faCloudSun,
  faExclamationCircle,
  faLink,
  faSliders,
  faSun,
  faTint,
  faTrashAlt,
  faUnlink,
} from '@fortawesome/free-solid-svg-icons';
import Modal from "../views/Modal";

/*TODO: Check why sometimes getting an uncaught error */
export default function PlantPresenter() {
  const [plants, setPlants] = useState(null);
  const {user} = useAuth();
  useEffect(() => {

    if (plants === null) {
      fetchData().catch(err => console.error(err.message));
    }

    async function fetchData() {
      await readUserData(user, "plants").then((data => {
        setPlants(data)
      })).catch(err => console.error(err.message));
    }
  }, [user, plants])

  function Plant({name, data, watering, sunlight, productID}) {
    const [expanded, setExpanded] = useState(false);
    const [latest, setLatest] = useState({})
    const [connected, setConnected] = useState(false)
    const [isWatering, setIsWatering] = useState(false);
    const [lightOptions, setOptions] = useState([])
    const {nav} = useNavigate();
    const {user} = useAuth()

    function handleWaterClick() {
      if (plants[name].settings.type === "Automatic") {
        return
      }
      setWateredTrue(name);
      setIsWatering(true);
      setTimeout(() => {
        setIsWatering(false)
      }, 2000)
    }

    function handleClick(e) {
      e.preventDefault()
      setExpanded(prevState => !prevState);
    }

    useEffect(() => {
      let latestDate = Object.keys(data).map((x) =>
        parseInt(x)).reduce((a, b) => Math.max(a, b))
      let latest = data[latestDate]
      setLatest(data[latestDate])
      setOptions(weatherIcon(latest.uvIntensity))
      if (productID !== 'RaspberryPi') {
        setConnected(true)
      }
    }, [user, data, productID])

    function getMoistureColor(actual, wateringPreset) {
      const lowerLimit = wateringPreset.min;
      const upperLimit = wateringPreset.max;

      return (actual >= lowerLimit && actual <= upperLimit) ? 'green' : 'red';
    }

    function getTemperatureColor(temperature) {
      return (temperature >= 10 && temperature <= 30) ? 'green' : 'red';
    }

    function wateringToValue(watering) {
      //The plan is to trigger the automatic watering system based on the minimum value.
      switch (watering) {
        case 'Frequent':
          return {min: 60, max: 90};
        case 'Average':
          return {min: 30, max: 60};
        case 'Minimum':
          return {min: 15, max: 30};
        case 'None':
          return {min: 0, max: 15};
        //Default values in case a plant has no watering information.
        default:
          return {min: 30, max: 60};
      }
    }

    function sunlightToValue(sunlight) {
      const mapping = {
        'Full shade': {min: 0.1, max: 0.4},
        'Part shade': {min: 0.4, max: 0.7},
        'Full sun': {min: 0.7, max: 1.0},
      };
      //Default values in case a plant has no sunlight information.
      let min = 0.3;
      let max = 0.8;

      if (Array.isArray(sunlight)) {
        const values = sunlight.filter((value) => mapping.hasOwnProperty(value));
        if (values.length > 0) {
          min = Math.min(...values.map((value) => mapping[value].min));
          max = Math.max(...values.map((value) => mapping[value].max));
        }
      }
      return {min, max};
    }

    let wateringValue = wateringToValue(watering);
    let sunlightValue = sunlightToValue(sunlight);
    let image = plants[name].plantRecommendedVitals.image;
    if (!image || image === "NaN") {
      image = elephant
    }
    const weatherIcon = (sunlight) => {
      if (sunlight < 0.4) {
        return (
          [faCloud, {color: 'black'}]
        )
      }
      if (sunlight >= 0.4 && sunlight < 0.7) {
        return (
          [faCloudSun, {color: 'grey'}]
        )
      } else {
        return (
          [faSun, {color: 'yellow'}]
        )
      }
    }
    return (
      <div className="plant-container">
        {connected ?
          <div id={name} className={`expandable-div ${expanded && connected ? "expanded" : ""}`}
               onClick={handleClick}>
            <div className="card-title" style={{container: "center"}}>
              <img src={image} width="100" height="100"
                   alt={"Oh no your plant picture is gone"}/>
              <span style={{padding: "0.5em", textTransform: 'capitalize'}}><b>{name}</b></span>
            </div>
            <div className="plant-data">
              <div className="row">
                <div className="col">
                  <div className="circle"
                       style={{color: getMoistureColor(latest.soilMoisture, wateringValue)}}>
                    <b>{latest.soilMoisture}{'%'}</b></div>
                  <p style={{color: 'black'}}
                     title={'Optimal: '+`${watering} ${wateringValue.min}% - ${wateringValue.max}%`}>Moisture</p>
                </div>
                <div className="col">
                  <div className="circle"
                  >
                    <FontAwesomeIcon icon={lightOptions.at(0)}
                                     style={{color: (latest.uvIntensity >= sunlightValue.min && latest.uvIntensity <= sunlightValue.max) ? 'green' : 'red'}}
                                     size='2xl'
                                     title={(latest.uvIntensity >= sunlightValue.min && latest.uvIntensity <= sunlightValue.max) ? `Light in optimal range: ${latest.uvIntensity + ' [' + sunlightValue.max + ', ' + sunlightValue.min + ']'}` : `Light outside optimal range: ${latest.uvIntensity + ' [' + sunlightValue.max + ', ' + sunlightValue.min + ']'}`}/>
                  </div>
                  <p
                    title={'Optimal: '+`${sunlight.join(', ') + ' [' + sunlightValue.max + ', ' + sunlightValue.min + ']'}`}
                    style={{color: 'black'}}>Light
                  </p>
                </div>
                <div className="col">
                  <div className="circle"
                       style={{color: getTemperatureColor(latest.temperature)}}>
                    <b>{latest.temperature}{"\u00B0" + "C"}</b></div>
                  <p style={{color: 'black'}} title={'Optimal: 10\u00B0C - 30\u00B0C'}>Temperature
                  </p>
                </div>
                <div className="col">
                  <div className="circle"
                       style={(latest.waterLevel) ? {color: 'green'} : {color: 'red'}}><FontAwesomeIcon
                    icon={latest.waterLevel ? faCheckCircle : faExclamationCircle} size='2xl'
                    title={latest.waterLevel ? 'Full' : 'Refill water tank'}/>
                  </div>
                  <p style={{color: 'black'}}>Waterlevel</p>
                </div>
              </div>

              <div id="icons__row" className="row">
                <Link alt="History" to={`/history/${name}`} state={data} id="graph" className={"icon--small tooltip"}
                      title={'History'}>{
                  <FontAwesomeIcon
                    icon={faChartLine} style={{color: 'black'}} size='xl'/>}</Link>

                <button alt="Water your plant" id="waterdrop" className={"icon--small tooltip"} type={"button"}
                        title='Water your plant'
                        onClick={handleWaterClick}>{<FontAwesomeIcon icon={faTint} style={{color: 'black'}} size='xl'/>}
                </button>
                <div alt="Settings" id="settings-icon" className="icon--small tooltip" title='Settings'><Link
                  to={`/settings/${name}`}
                  state={plants}>
                  <FontAwesomeIcon icon={faSliders} size='xl' style={{color: 'black'}}/>
                </Link></div>
                <button alt="Delete" className={"icon--small tooltip"} title='Delete plant' type={"button"}
                        style={{verticalAlign: 'super'}}
                        onClick={(event) => removePlant(name).then(() => {
                          window.location.reload();
                        })}>
                  {<FontAwesomeIcon icon={faTrashAlt} size='xl'
                                    style={{color: 'black'}}/>}</button>
                <button alt="Disconnect plant" id="Update" className={"icon--small tooltip"} title='Disconnect plant'
                        type={"button"}
                        style={{verticalAlign: 'super'}}
                        onClick={(event) => disconnectPlant(user, name).then(() => {
                          window.location.reload();
                        })}>
                  {<FontAwesomeIcon icon={faUnlink} size='xl'
                                    style={{color: 'black'}}/>}</button>
              </div>
            </div>
          </div> :
          <div id={name} className={`expandable-div ""`}>
            <div className="card-title">
              <img src={image} width="100" height="100"
                   alt={"Oh no your plant picture is gone"}/>
              <span style={{padding: "0.5em", textTransform: 'capitalize'}}>
                <b>{name}</b>
                <p>
                    <Link 
                      alt="Connect" className='connect icon--small' to='/connect'
                      state={{plantName: name}}> <FontAwesomeIcon
                      icon={faLink}
                      size='xl'
                      title='Connect to PotBot'
                    />
                   </Link>
                  <button alt="Delete" className='connect icon--small' type={"button"}
                          onClick={(event) =>
                            removePlant(name).then(() => {
                              window.location.reload();
                            })}><FontAwesomeIcon icon={faTrashAlt} size='xl'
                                                 title='Delete plant'/>
                  </button>
                </p>
              </span>
            </div>
          </div>}
        <Modal active={isWatering} message={"Your plant is being watered!"}/>
      </div>)
  }

  return <PlantView user={user} plants={plants} Plant={Plant}/>
}
