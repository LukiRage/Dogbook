import axios from "axios";
import "./register.css";
import { useRef } from "react";
import { useNavigate } from "react-router";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      //create user after validation
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        history("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLoginClick = () => {
    history("/login");
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <form className="registerBox" onSubmit={handleClick}>
            <h1 className="registerTitle">Register</h1>
            <input
              placeholder="Username"
              required
              ref={username}
              className="registerInput"
            />
            <input
              placeholder="Email"
              type="email"
              required
              ref={email}
              className="registerInput"
            />
            <input
              placeholder="Password"
              type="password"
              minLength="6"
              required
              ref={password}
              className="registerInput"
            />
            <input
              placeholder="Password"
              type="password"
              required
              ref={passwordAgain}
              className="registerInput"
            />
            <button className="registerSingIn" type="submit">
              Sign Up
            </button>
            <button className="registerLoginButton" onClick={handleLoginClick}>
              Log into Account
            </button>
          </form>
        </div>
        <div className="registerRight">
          <h3 className="registerLogo">Dogbook</h3>
          <span className="registerDesc">
            Join the thriving dog community near you and make new friends on
            Dogbook. Register now!
          </span>
        </div>
      </div>
    </div>
  );
}
