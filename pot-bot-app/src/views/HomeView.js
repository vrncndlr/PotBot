import {Link} from "react-router-dom";
import {useAuth} from "../firebaseModel";
import React from "react";
import "firebase/database";
import '../styling/homeView.css';
import PlantPresenter from "../presenters/PlantPresenter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOut} from "@fortawesome/free-solid-svg-icons";

export default function HomeView() {
  const {user, logOut} = useAuth();

  return (
    <div className="Home module">
      {user && <PlantPresenter/>}
      <div className="logout-btn">
        {user && <LogoutBtn/>}</div>
      {!user && <Login/>}
    </div>
  );

  function Login() {
    return (
      <>
        <h2>To access this page you have to login</h2>
        <Link to="/">Back to login</Link>
      </>)
  }

  function LogoutBtn() {
    return (
      <Link className="logout-btn" to="/">
        <button className="logout-btn" type="button" onClick={logOut}><FontAwesomeIcon icon={faSignOut}
                                                                                       style={{color: 'white !important'}}
                                                                                       size='2xl'/></button>
        {/**/}
      </Link>
    )
  }

}
