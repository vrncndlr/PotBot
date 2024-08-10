import {Link} from "react-router-dom";
import {useState} from "react";
import '../styling/loginView.css'

/*TODO: Move logic to presenter**/
function SignUpView({username, setUsername, password, setPassword, handleSubmit, error}) {
  const [showError, setShowError] = useState(false);

  function errorHandling() {

    if (!error.message) {
      return '';
    }

    if (error.message.includes("auth/email-already-in-use")) {
      return "This E–mail is already in use";
    }

    if (error.message.includes("auth/invalid-email")) {
      return "Email not valid, try again";
    }

    if (error.message.includes("auth/weak-password")) {
      return "Password should be at least 6 characters";
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
        <h1 className="h1SignIN" style={{color: 'black'}}>Create an account</h1>
        <div className={`error ${showError ? '' : 'errorhidden'}`}>
          {errorHandling()}
        </div>
        <form onSubmit={handleFormSubmit}>
          <input
            className="signup-input"
            type="text"
            id="username"
            name="username"
            placeholder="Email"
            value={username}
            onChange={(e) => {
              handleInputChange();
              setUsername(e.target.value)
            }}
            required
          />
          <input
            className="signup-input"
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
          <button type="submit">Sign up</button>
          <Link to="/" className="back-btn"> Back to login
            {/* <button className="back-btn">Back to login</button> */}
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUpView;
