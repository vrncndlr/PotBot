import React from "react";
import {Link} from 'react-router-dom';
import "../styling/Settings.css";
import "../styling/dropdown.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloudUpload} from "@fortawesome/free-solid-svg-icons";

function SettingsView({
                        plantName,
                        handleNotificationToggle,
                        setWateringPreference,
                        wateringType,
                        setInterval,
                        interval, intervalText
                      }) {
  return (
    <div className="settings module">
      <h2>Settings for {plantName}</h2>
      <div className={"row"}>
        <p className="notificationToggle" style={{fontSize: '1.2rem'}}>Receive notifications <input
          type="checkbox"
          id="notificationToggle"
          onChange={handleNotificationToggle}
        /></p>
      </div>
      {/* Changed this into select-option tags instead, less code
      But still need to figure out how to display the interval selection right away*/}
      <div className="dropdown column">
        <label htmlFor="watering-options" className="notifications">Chose what watering you want </label>
        <select id="watering-options" onChange={(event) => setWateringPreference(event.target.value)}>
          <option value="Choose an option">{wateringType}</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
          <option value="Scheduled">Scheduled</option>
        </select>
        {wateringType === "Scheduled" && (
          <select onChange={(event) => setInterval(event.target.value)} className="interval">
            <option id={intervalText} value={interval}>{intervalText}</option>
            <option id="four-days" value={96}>4 days</option>
            <option id="one-week" value={168}>1 week</option>
            <option id="two-week" value={336}>2 weeks</option>

          </select>
        )}
      </div>
      <p className="notifications" style={{fontSize: '1.2rem'}}>Upload your own photo of your plant <Link id="upload"
                                                                                                           to='/image'
                                                                                                           state={{plantName: plantName}}>
        <FontAwesomeIcon icon={faCloudUpload}
                         title={"Upload your own picture"}
                         size="xl"></FontAwesomeIcon> </Link></p>

      <Link to="/home" className="back-btn">Back to your plants
      </Link>
    </div>
  );
}

export default SettingsView;
