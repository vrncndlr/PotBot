import React from 'react';
import {Link} from "react-router-dom";

function Header() {
  return (
    <div className={"header"}>
      <Link to="/home"><h1>PotBot.</h1></Link>
      <Link to="/about">About us</Link>
    </div>
  );
}

export default Header;
