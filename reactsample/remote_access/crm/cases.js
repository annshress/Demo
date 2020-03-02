import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCRMCases(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/cases/?${queryString}`
  });
}

export function handleGetCRMCases({ company_id, ...params }) {
  const queryString = objToQueryString(params);
  try {
    return fetchCRMCases(company_id, queryString);
  } catch (err) {
    console.log(err);
  }
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


function deleteCRMCase(company_id, instance_id) {
  return APICaller({
    method: "DELETE",
    url: `${BASE_URL}crm/${company_id}/cases/${instance_id}/`
  });
}

export function handleDeleteCRMCase({ company_id, instance_id }) {
  try {
    return deleteCRMCase(company_id, instance_id);
  } catch (e) {
    console.log(e);
  }
}
