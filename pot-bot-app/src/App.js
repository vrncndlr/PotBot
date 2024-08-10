import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import LoginPresenter from "./presenters/LoginPresenter";
import SignUpPresenter from "./presenters/SignUpPresenter";
import ResetPasswordPresenter from "./presenters/ResetPasswordPresenter";
import AddPlantPresenter from "./presenters/AddPlantPresenter";
import HomePresenter from "./presenters/HomePresenter";
import HistoryPresenter from "./presenters/HistoryPresenter";
import SettingsPresenter from "./presenters/SettingsPresenter";
import ProfilePresenter from "./presenters/ProfilePresenter";
import AboutPresenter from "./presenters/AboutPresenter";
import ChangeUserName from "./views/ChangeUserName";
import {UserAuthContextProvider} from "./firebaseModel";
import "./styling/App.css";
import ConnectPotBotPresenter from "./presenters/ConnectPotBotPresenter";
import ImageUploadPresenter from "./presenters/ImageUploadPresenter";

function App() {
  return (
    <div className="App">
      <Router>
        <UserAuthContextProvider>
          {/* Render the side menu view on all pages except login and signup */}
          {/*{window.location.pathname !== "/signup" &&*/}
          {/*  window.location.pathname !== "/login" && <SideMenuView/>}*/}
          <Header/>
          <Routes>
            <Route path="/" element={<LoginPresenter/>}/>
            <Route path="/signup" element={<SignUpPresenter/>}/>
            <Route path="/reset" element={<ResetPasswordPresenter/>}/>
            <Route path="/name" element={<ChangeUserName/>}/>
            <Route path="/home" element={<HomePresenter/>}/>
            <Route path="/settings/:plantName" element={<SettingsPresenter/>}/>
            <Route path="/connect" element={<ConnectPotBotPresenter/>}/>
            <Route
              path="/addNewPlant"
              element={<AddPlantPresenter/>}
            />
            <Route path="/history/:plantName" element={<HistoryPresenter/>}/>
            <Route path="/profile" element={<ProfilePresenter/>}/>
            <Route path="/about" element={<AboutPresenter/>}/>
            <Route path="/image" element={<ImageUploadPresenter/>}/>
          </Routes>
        </UserAuthContextProvider>
      </Router>
    </div>
  );
}

export default App;
