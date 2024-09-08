import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../src/context/PrivateRoute";
import Appbar from "./components/app_bar/App_bar";
import SignUpPage from "./views/sign_up/Sign_up";
import LoginPage from "./views/login/Login_page";
import HomePage from "./views/home/Home_page";

function App() {
  return (
    <BrowserRouter>
      <Appbar />
      <Routes>
        <Route exact path="/" Component={LoginPage} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route
          exact
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
