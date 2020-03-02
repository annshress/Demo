import { store } from "../store";

// this function will check if user has token in redux store
export function getToken() {
  try {
    return store.getState().account.token;
  } catch (e) {
    return undefined;
  }
}

export function isAuthenticated() {
  const token = getToken();

  if (!token) {
    return false;
  }

  return token && typeof token === "string" && token.length > 20;
}

export function isAnonymous() {
  const token = getToken();

  if (!token) {
    return true;
  }

  return token && typeof token === "string" && token.length === 0;
}
