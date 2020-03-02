import { APICaller, BASE_URL } from "../..";

function login(data) {
  return APICaller({
    method: "POST",
    url: `${BASE_URL}api/auth/jwt/`,
    data: data
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


function activate(uid, token) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}api/auth/activate_account/${uid}/${token}/`
  });
}

export function handleActivate({ uid, token }) {
  try {
    return activate(uid, token);
  } catch (err) {
    console.log("error", err);
  }
}
