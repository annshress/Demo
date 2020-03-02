import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCRMopportunities(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/opportunities/?${queryString}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleAddCRMoppotunity({ company_id, data }) {
  try {
    return addCRMopportunity(company_id, data);
  } catch (err) {
    console.log(err);
  }
}

function editCRMopportunity(company_id, instance_id, data) {
  return APICaller({
    method: "PATCH",
    url: `${BASE_URL}crm/${company_id}/opportunities/${instance_id}/`,
    data: data
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
