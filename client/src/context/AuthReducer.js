const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        role: "LoginUser",
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        role: "LoginUser",
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
        role: "LoginUser",
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "LOGIN_START_GUEST":
      return {
        user: null,
        isFetching: true,
        error: false,
        role: "guest", // Ustawiamy rolę na "guest"
      };
    case "LOGIN_SUCCESS_GUEST":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        role: "guest",
      };
    case "LOGIN_FAILURE_GUEST":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
        role: "guest",
      };
    default:
      return state;
  }
};

export default AuthReducer;
