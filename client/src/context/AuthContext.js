import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
  role: localStorage.getItem("role") || null, // Dodaj pole role
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("role", state.role); // Zapisz pole role do localStorage
  }, [state.user, state.role]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        role: state.role, // Dodaj pole role do wartości kontekstu
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
