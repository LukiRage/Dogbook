import "./login.css";
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

import { useNavigate } from "react-router";

export default function Login() {
  const email = useRef();
  const password = useRef();

  const history = useNavigate();

  const { isFetching, dispatch } = useContext(AuthContext); //const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };
  //console.log(user);

  const handleRegisterClick = () => {
    history("/register");
  };

  const handleGuestForward = () => {
    history("/loginguest");
  };

  const handleHelp = () => {
    window.location.href = "/help";
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Dogbook</h3>
          <span className="loginDesc">
            Discover Dogbook, connect with friends and fellow dog lovers in your
            area. Join us today and share the joy of dogs!
          </span>
          <button className="loginGuest" onClick={handleGuestForward}>
            Log in as Guest
          </button>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <h1 className="loginTitle">Login</h1>
            <input
              placeholder="Email"
              type="email"
              className="loginInput"
              required
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              required
              ref={password}
              minLength="4"
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" zise="20px" />
              ) : (
                "Log in"
              )}
            </button>
            <span className="loginForgot" onClick={handleHelp}>
              Need any help?
            </span>
            <button
              className="loginRegisterButton"
              onClick={handleRegisterClick}
            >
              {isFetching ? (
                <CircularProgress color="inherit" zise="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
