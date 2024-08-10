import React, {useEffect, useState} from "react";
import {connectPotBot, db, useAuth} from "../firebaseModel";
import ConnectPotBotView from "../views/ConnectPotBotView";
import {useLocation, useNavigate} from "react-router-dom";
import {onChildChanged, ref} from "firebase/database";

export default function ConnectPotBotPresenter() {
  const {user} = useAuth();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productID, setProductID] = useState("");
  const {state} = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function connectPotBotAndCheck() {
      try {
        await connectPotBot(productID, {uid: user.uid, plant: state.plantName});
        const dbRef = ref(
          db,
          `users/${user.uid}/plants/${state.plantName}`
        );
        onChildChanged(dbRef, (snapshot) => {
          if (snapshot.exists() && snapshot.val() === productID) {
            setConnected(true);
            setTimeout(() => {
              setLoading(false);
              setTimeout(() => {
                navigate("/home");
              }, 1000);
            }, 3000);
          }
        });
      } catch (error) {
      }
    }

    if (loading && productID) {
      connectPotBotAndCheck();
    }
  }, [user, productID, state, loading, navigate]);


  function connectButtonHandler() {
    setLoading(true);
  }

  return (
    <div>
      {!connected && !loading && (
        <ConnectPotBotView
          loading={loading}
          productID={productID}
          setProductID={setProductID}
          handleSubmit={connectButtonHandler}
        />
      )}
      {loading && !connected && (
        <div style={{textAlign: "center"}}>
          <h2>Connecting PotBot...</h2>
          <img src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="Loading"/>
        </div>
      )}
      {loading && connected && (
        <div style={{textAlign: "center"}}>
          <h2>Your PotBot is now connected!</h2>
        </div>
      )}
    </div>
  );
}
