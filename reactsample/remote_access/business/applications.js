import { BASE_URL, APICaller, objToQueryString } from "..";

// function that makes the api request and returns a Promise for response
function fetchCategories(company_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}company/${company_id}/application/categories/`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function handleActivateApplication({ company_id, data }) {
  try {
    return activateApplication(company_id, data);
  } catch (e) {
    console.log(e);
  }
}
