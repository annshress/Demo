import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCRMleads(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/leads/?${queryString}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

function editCRMLead(company_id, instance_id, data) {
  return APICaller({
    method: "PATCH",
    url: `${BASE_URL}crm/${company_id}/leads/${instance_id}/`,
    data: data
  });
}

export function handleEditCRMLead({ company_id, instance_id, data }) {
  try {
    return editCRMLead(company_id, instance_id, data);
  } catch (err) {
    console.log(err);
  }
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

