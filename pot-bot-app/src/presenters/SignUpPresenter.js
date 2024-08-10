import React, {useState} from 'react';
import SignUpView from "../views/SignUpView";
import HomePresenter from "./HomePresenter";
import {useAuth, writeUserData} from "../firebaseModel";
import {useNavigate} from "react-router-dom";

/*TODO:Add function for setting up display-name.*/
function SignUpPresenter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const {user, signUp, currentUser} = useAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      await writeUserData(email, email)
    } catch (err) {
      setError(err);
      //console.log(err);
    }
    if (currentUser != null) {
      navigate("/home");
    }
  };

  return (
    <>
      {!user && (
        <SignUpView
          username={email}
          setUsername={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          handleSubmit={handleSubmit}
        />
      )}
      {user && <HomePresenter/>}
    </>
  );
}

export default SignUpPresenter;
