import React, {useState} from 'react';
import '../styling/loginView.css'
import {Link} from 'react-router-dom';

function LoginView({username, setUsername, password, setPassword, handleSubmit, error}) {
  const [showError, setShowError] = useState(false);

  function errorHandling() {
    if (!error.message) {
      return '';
    }

    if (error.message.includes("auth/invalid-email")) {
      return "Email not valid, try again";
    }

    if (error.message.includes("auth/user-not-found")) {
      return "No user is connected to this E–Mail"
    }

    if (error.message.includes("auth/wrong-password")) {
      return "Wrong password, please try again";
    }

    if (error.message.includes("auth/internal-error")) {
      return "Please enter a password";
    }

    return error.message;
  }


  function handleInputChange() {
    setShowError(false);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    handleSubmit(e);
    setShowError(!!error);
  }

  return (
    <div>
      <div className="container module">
        <p className='pLogin'>Log into your PotBot account</p>
        <div className={`error ${showError ? '' : 'errorhidden'}`}>
          {errorHandling()}
        </div>
        <form onSubmit={handleFormSubmit}>
          <input
            className="login-input"
            type="email"
            id="email"
            name="email"
            placeholder="E-mail"
            value={username}
            onChange={(e) => {
              handleInputChange();
              setUsername(e.target.value)
            }}
            required
          />
          <input
            className="login-input"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              handleInputChange();
              setPassword(e.target.value)
            }}
            required
          />
          <Link to="/reset">forgot your password?</Link>
          <button className="sign-in" type="submit">Sign in</button>
        </form>
        <button className="create-account">
          <Link to="/signup" className="create-account-text">Create an account</Link>
        </button>
      </div>
    </div>
  );
}

export default LoginView;
