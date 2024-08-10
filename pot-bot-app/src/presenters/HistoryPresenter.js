import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import HistoryView from "../views/HistoryView";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function HistoryPresenter() {
  let {plantName} = useParams();
  let {state} = useLocation();
  const [soilMoistureData, setSoilMoistureData] = useState({});
  const [uvData, setUVData] = useState({});
  const [temperatureData, setTemperatureData] = useState({});
  // const [graphData, setGraphData] = useState({})
  // const [plantName, setPlantName] = useState(null); //Ideally the plant name should be fetched as well

  useEffect(() => {
    function makeGraph(y, label, borderColor) {
      const labels = timeArray;

      const data = {
        labels,
        datasets: [
          {
            label,
            data: labels.map((v, i) => y.at(i)),
            borderColor,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },

        ],
      }
      return data;
    }

    const dateTimeArray = Object.keys(state).map(x => state[x].dateTime)
    const timeArray = dateTimeArray.map(dateTime => dateTime.split(' ')[1]);
    const soilMois = Object.keys(state).map(x => state[x].soilMoisture)
    const uvValues = Object.keys(state).map(x => state[x].uvIntensity)
    const temperatureValues = Object.keys(state).map(x => state[x].temperature)
    //const name = "" //Unsure how to get the name since it is a level above the data object
    setSoilMoistureData(makeGraph(soilMois, "Soil Moisture", 'rgb(255, 99, 132)'))
    setUVData(makeGraph(uvValues, "UV Light", 'rgb(54, 162, 235)'))
    setTemperatureData(makeGraph(temperatureValues, "Temperature", 'rgb(255, 205, 86)'))
    // console.log(Object.keys(state).map(x => state[x])) //Gives the entire object
  }, [state])

  return (
    <HistoryView
      plantName={plantName}
      soilMoistureData={soilMoistureData}
      uvData={uvData}
      temperatureData={temperatureData}/>
  )
}
