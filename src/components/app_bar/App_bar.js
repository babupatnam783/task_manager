import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App_bar.css';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Cookies from 'js-cookie';

const Appbar = () => {
  let navigate = useNavigate();
  const token = Cookies.get("token");

  function handleLoginClick() {
    navigate('/login')
  }
  function handleLogout() {
    Cookies.remove('token');
    navigate('/login')
  }

  function handleSignupClick() {
    navigate('/signup')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo"><EventNoteIcon /></div>
      <ul className="navbar-links">
        {token? <>
          <li>
            <button className="navbar-button" onClick={handleLogout}>Logout</button></li>
        </> :
          <>
            <li>
              <button className="navbar-button" onClick={handleLoginClick}>Login</button></li>
            <li><button className="navbar-button navbar-signup" onClick={handleSignupClick}>Signup</button></li>
          </>}

      </ul>
    </nav>
  );
};

export default Appbar;
