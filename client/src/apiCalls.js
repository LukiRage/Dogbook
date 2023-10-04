import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const loginCallGuest = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START_GUEST" });
  try {
    const res = await axios.post("auth/login/guest", userCredential);
    dispatch({ type: "LOGIN_SUCCESS_GUEST", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE_GUEST", payload: err });
  }
};
