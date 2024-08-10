import {useAuth} from "../firebaseModel";
import React, {useState} from "react";


export default function ChangeUserName() {
  const {updateProfileName} = useAuth();
  const [userName, setUsername] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateProfileName(userName)

      return window.close();
    } catch (e) {
      console.error(e.message)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" id="change" onChange={event => setUsername(event.target.value)}></input>
        <button type="submit">Confirm</button>
      </form>
    </div>
  )

}
