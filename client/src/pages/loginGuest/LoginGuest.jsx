import "./loginGuest.css";
import { useContext, useRef } from "react";
import { loginCallGuest } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

export default function LoginGuest() {
  const email = useRef();
  const password = useRef();

  const { isFetching, dispatch } = useContext(AuthContext); //const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    console.log(dispatch);
    e.preventDefault();
    loginCallGuest(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };
  //console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Login Guest DogBook</h3>
          <span className="loginDesc">
            Discover Dogbook, connect with friends and fellow dog lovers in your
            area. Join us today and share the joy of dogs!
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <h1 className="loginTitle">Login Guest</h1>
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
              minLength="6"
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" zise="20px" />
              ) : (
                "Log in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
