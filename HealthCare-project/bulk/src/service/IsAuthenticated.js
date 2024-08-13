export const isUserAuthenticated = () => {
  let idToken = sessionStorage.getItem("idToken");
  if (idToken !== "" && idToken != null) {
    return true;
  }
  return false;
};

export const isRememberMeActive = () => {
  if (
    localStorage.getItem("rememberMe") === "true" &&
    localStorage.getItem("attributes") != null &&
    localStorage.getItem("attributes") !== ""
  ) {
    return true;
  }
  return false;
};
