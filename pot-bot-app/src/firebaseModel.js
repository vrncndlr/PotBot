/* Här lägger vi in alla funktion vi kan behöva från firebase.
Exempel på dessa kan vara getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile */
import {createContext, useContext, useEffect, useState} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {firebaseConfig} from "./firebaseConfig";
import {child, get, getDatabase, ref, remove, set, update} from "firebase/database";
import {initializeApp} from "firebase/app";
/*
TODO: add functions for reset password
 */
/*Import {useAuth} in the other files to use functions for authentication */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext(null);
const db = getDatabase(app);

export function UserAuthContextProvider({children}) {
  const [user, setUser] = useState({});

  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password).catch(err => {
      console.error(err)
    });
  }
  async function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function updateProfileName(name) {
    return updateProfile(auth.currentUser, {displayName: name});
  }

  useEffect(() => {
    onAuthStateChanged(auth, (current) => {
      //console.log("Auth", current);
      setUser(current);

    });
    /*return () => {
      unsubscribe();
    }*/
  }, []);
  return (<AuthContext.Provider
      value={{user, signIn, signUp, logOut, updateProfileName}}>
      {children}
    </AuthContext.Provider>
  );
}

/*
* Used when creating a user to webapp. This creates a user folder for this user*/
async function writeUserData(name, email) {
  return await set(ref(db, 'users/' + auth.currentUser.uid), {
    name: name,
    email: email,
    plants: ""//maybe add this later
  })
}

async function readUserData(user, path) {
  const dbRef = ref(db, `users/${user.uid}/${path}`)
  return get(dbRef).then(snapshot => {
    return snapshot.val();
  }).catch(err => {
    console.log(err.message)
  })
}

async function readPlantDatabase(pathKey) {
  const dbRef = ref(db, `/plantsData/${pathKey}`)
  return get(dbRef).then(snapshot => {
    return snapshot.val();
  }).catch(err => {
    console.log(err.message)
  })
}

/*
 * @param {Object} data contains all plantVitals from API, need to get this from user when API not working
 * @param {String} plantName plants name taken from API, need to get this from user when API not working
 * @param {Object} user this user
 ** Setting for frequency and soil_moisture need to be taken from the data object *
 * */
async function addNewPlant(user, plantName, data) {
  const dbRef = await ref(db, `users/${user.uid}`);
  //Check if the user already has this plant
  //Maybe we should have a error handler here to handle if user has this plant name
  //so the user can add another plant with this name
  await get(child(dbRef, `/plants/${plantName}`)).then((response) => {
    if (response.exists()) {
      //Plant with this name already exists
      //Add functionality to have own name for plant
    } else {
      console.log("no data found")
      //Create folder with plants and a folder with this plant name
      set(ref(db, `users/${user.uid}/plants/${plantName}`), {
        productID: 'RaspberryPi',
        measureData: 'To be added',
        notificationSettings: {notificationToggle: true},
        plantRecommendedVitals: data,
        settings: {
          amount: 100,
          frequency: 0,
          soil_moisture: data.watering,
          type: "Manual",
          water: 0
        }
      })
    }
  }).catch(err => console.error(err))
}

/*
* data is written as this example of a plant measureData object {timestamp, timestamp2,...}
* and m1 is then as {date: '2023-04-24 15:00', temp: 22, humidity: 50, ...}
* */
async function updatePlantData(user, path, data) {
  const dbRef = await ref(db, `users/${user.uid}/${path}`);
  return await update(dbRef, data);
}

/*
 * Connect the potBot to the users currentPlant
 * @param {string} potBotKey input from user
 * @param {Object} data {uid: user.uid, plant: name}
 * when potBot is connected it will write the productID to user plant
 */
async function connectPotBot(potBotKey, data) {
  const dbRef = await ref(db, `potbots/${potBotKey}`);
  return await update(dbRef, data);
}

async function disconnectPlant(user, name) {
  if (!window.confirm(`Are you sure you want to disconnect your ${name}? :(`)) return;
  const dbRef = await ref(db, `users/${user.uid}/plants/${name}`);
  return await update(dbRef, {productID: "RaspberryPi"})
}

async function removePlant(name) {
  if (!window.confirm(`Are you sure you want to remove your ${name}? :(`)) return;
  const {uid} = auth.currentUser;
  const dbRef = await ref(db, `users/${uid}/plants/${name}`);
  return await remove(dbRef)
}

/*
* boolean to check if user has a plant registered*/
async function hasPlants(user) {
  const dbRef = ref(db, `users/${user.uid}`);
  try {
    const response = await get(child(dbRef, `/plants`));
    return response.exists();
  } catch (err) {
    return console.error(err.message);
  }
}

/**
 * This function is used by the "water plant"-button
 * When clicked it sends a "1" to the database
 * @param {*} user
 */
function setWateredTrue(name) {
  const path = `/plants/${name}/settings`;
  const data = {water: 1};
  updatePlantData(auth.currentUser, path, data);
  /** DONE
   * Return some sort of confirmation to the user that the plant has been watered
   * aka 'water' setting has been changed to 0
   */
}

async function notificationToggle(user, toggleValue) {
  const dbRef = ref(db, `users/${user.uid}/notificationSettings`);
  try {
    await update(dbRef, {
      notificationToggle: toggleValue
    });
    console.log("Notification settings updated successfully!");
  } catch (error) {
    console.error("Error updating notification settings: ", error);
  }
}

async function searchPlants(searchTerm) {
  const dbRef = ref(db, "plantsData/species_data_dumb");
  const snapshot = await get(dbRef);
  const plantData = snapshot.val();

  return Object.values(plantData).filter(
    (plant) => {
      const commonNameMatch = plant.common_name.toLowerCase().includes(searchTerm.toLowerCase());
      const scientificNameMatch = plant.scientific_name && plant.scientific_name.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));
      const otherNameMatch = plant.other_name && plant.other_name.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

      return commonNameMatch || scientificNameMatch || otherNameMatch
    });

}


export {
  searchPlants,
  connectPotBot,
  hasPlants,
  updatePlantData,
  addNewPlant,
  readUserData,
  writeUserData,
  setWateredTrue,
  removePlant,
  notificationToggle,
  readPlantDatabase,
  db,
  disconnectPlant
}

export function useAuth() {
  return useContext(AuthContext);
}
