import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import DogProfile from "./pages/dogProfile/DogProfile";
import LoginGuest from "./pages/loginGuest/LoginGuest";
//import Test from "./pages/test/Test";
import Messenger from "./pages/messenger/Messenger";
import DogRegister from "./pages/dogRegister/DogRegister";
import GuestRegister from "./pages/guestRegister/GuestRegister";
import PostPage from "./pages/postPage/PostPage";
// import Register from "./pages/register/Register";
//import {Person} from "@mui/icons-material";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import DogProfileForGuest from "./pages/dogProfileForGuest/DogProfileForGuest";
import Event from "./pages/event/Event";
import Help from "./pages/helpPage/HelpPage";
import SettingsPage from "./pages/settingsPage/SettingsPage";
import MealInfoHub from "./pages/mealInfoHub/MealInfoHub";
import DiseaseInfoHub from "./pages/diseaseInfoHub/DiseaseInfoHub";

function App() {
  const { user, role } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/loginguest"
          element={user ? <Navigate to="/dog_profile" /> : <LoginGuest />}
        />

        <Route
          exact
          path="/dog_profile"
          element={
            user && role === "guest" ? (
              <DogProfileForGuest />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route exact path="/" element={user ? <Home /> : <Register />} />

        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          exact
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          exact
          path="/messenger"
          element={
            user && role === "LoginUser" ? <Messenger /> : <Navigate to="/" />
          }
        />
        <Route
          exact
          path="/profile/:username"
          element={
            user && role === "LoginUser" ? <Profile /> : <Navigate to="/" />
          }
        />

        <Route
          exact
          path="/event"
          element={
            user && role === "LoginUser" ? <Event /> : <Navigate to="/" />
          }
        />

        <Route
          exact
          path="/dog_profile/:dogname"
          element={
            (user && role === "LoginUser") || (user && role === "guest") ? (
              <DogProfile />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          exact
          path="/dog_register"
          element={
            user && role === "LoginUser" ? <DogRegister /> : <Navigate to="/" />
          }
        />

        <Route
          exact
          path="/registerGuest/:userId/:email"
          element={<GuestRegister />}
        />

        <Route exact path="/post/:postId" element={<PostPage />} />

        <Route exact path="/help" element={<Help />} />
        <Route exact path="/mealInfoHub" element={<MealInfoHub />} />
        <Route exact path="/diseaseInfoHub" element={<DiseaseInfoHub />} />

        <Route
          exact
          path="/settings"
          element={
            user && role === "LoginUser" ? (
              <SettingsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
