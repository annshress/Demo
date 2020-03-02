import { BASE_URL, APICaller } from "..";

// function that makes the api request and returns a Promise for response
function fetchDashboard(company_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}appointments/${company_id}/dashboard/`
  });
}

export function handleGetDashboard({ company_id, ...params }) {
  try {
    return fetchDashboard(company_id);
  } catch (err) {
    console.log("error", err);
  }
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleGetWidgetContent({ company_id, url }) {
  return APICaller({
    method: "GET",
    url: url
  });
}
