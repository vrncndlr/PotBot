import React from 'react';
import '../styling/loginView.css'
import {Link} from 'react-router-dom';

function ResetPasswordView() {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <div>
      <div className="container">
        <h2 className='reset'>Forgot your password?</h2>
        <p>Enter your email address and we will send you a reset link.</p>
        <form onSubmit={handleSubmit}>
          <input type="email"
                 id="email"
                 name="email"
                 placeholder="E-mail"
                 className="signup-input"
                 required/>
          <button type="submit"> Send email</button>
          <p><Link to="/">Back</Link></p>
        </form>
      </div>
    </div>
  );

}

export default ResetPasswordView;
