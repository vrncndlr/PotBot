import React, {useState} from 'react';
import LoginView from "../views/LoginView";
import {useAuth} from "../firebaseModel";
import {useNavigate} from "react-router-dom";
import HomePresenter from "./HomePresenter";

function LoginPresenter() {
  const {user, signIn} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signIn(username, password);
      navigate('/home');
    } catch (err) {
      //console.log(err.message);
      setError(err);
    }
  }

  return (
    <>
      {!user && <LoginView
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        error={error}
      />}
      {user && <HomePresenter/>}
    </>
  );
}

export default LoginPresenter;
