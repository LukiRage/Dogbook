export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccessStart = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailureStart = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const UNfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const LoginStartGuest = () => ({
  type: "LOGIN_START_GUEST",
});

export const LoginSuccessGuest = (user) => ({
  type: "LOGIN_SUCCESS_GUEST",
  payload: user,
});

export const LoginFailureGuest = (error) => ({
  type: "LOGIN_FAILURE_GUEST",
  payload: error,
});
