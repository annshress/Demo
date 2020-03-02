import { BASE_URL, APICaller } from "..";

// function that makes the api request and returns a Promise for response
function fetchCompany(c) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}company/`
  });
}

export function handleFetchCompany() {
  try {
    return fetchCompany();
  } catch (err) {
    console.log("error", err);
  }
}

function fetchSingleCompany(company_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}company/${company_id}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function handleCreateStripeConnection({ scope, code }) {
  // post information to create a connection with whyunified stripe account
  try {
    return createStripeConnection(scope, code);
  } catch (err) {
    console.log("error", err);
  }
}

function createPaypalConnection(data) {
  return APICaller({
    method: "POST",
    url: `${BASE_URL}payment/connect-paypal/`,
    data: data
  });
}

export function handleCreatePaypalConnection({ data }) {
  // post information to create a connection with whyunified stripe account
  try {
    return createPaypalConnection(data);
  } catch (err) {
    console.log("error", err);
  }
}

function createAuthorizeNetConnection(data) {
  return APICaller({
    method: "POST",
    url: `${BASE_URL}payment/connect-authorize/`,
    data: data
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleCreateFreeSubscription() {
  try {
    return APICaller({
      method: "POST",
      url: `${BASE_URL}payment/free-subscription/`
    });
  } catch (error) {
    console.log("error ", error);
  }
}

export function handleGetFreeSubscription() {
  try {
    return APICaller({
      method: "GET",
      url: `${BASE_URL}payment/free-subscription/`
    });
  } catch (error) {
    console.log("error ", error);
  }
}
