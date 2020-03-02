import { APICaller, BASE_URL } from "..";

export function requestSMSAuthentication(data) {
  try {
    return APICaller({
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function verifyQRCodeAuthentication(data) {
  try {
    return APICaller({
      method: "PUT",
      url: `${BASE_URL}mfa/qrcode/verify/`,
      data: data
    });
  } catch (e) {
    console.log("err", e);
  }
}
