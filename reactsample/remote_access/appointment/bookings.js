import { BASE_URL, APICaller, objToQueryString } from "..";
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


function editBooking(company_id, instance_id, data) {
  return APICaller({
    method: "PATCH",
    url: `${BASE_URL}appointments/${company_id}/booking/${instance_id}/`,
    data: data
  });
}

function deleteBooking(company_id, instance_id) {
  return APICaller({
    method: "DELETE",
    url: `${BASE_URL}appointments/${company_id}/booking/${instance_id}/`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleGetStripeDetails({ company, data }) {
  try {
    return getStripeDetails(company, data);
  } catch (err) {
    console.log("error", err);
  }
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleGetPaypalDetails({ company }) {
  try {
    return getPaypalDetails(company);
  } catch (err) {
    console.log("error", err);
  }
}
