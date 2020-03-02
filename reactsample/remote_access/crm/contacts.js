import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCRMContacts(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/contacts/?${queryString}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


function deleteCRMContact(company_id, instance_id) {
  return APICaller({
    method: "DELETE",
    url: `${BASE_URL}crm/${company_id}/contacts/${instance_id}/`
  });
}

export function handleDeleteCRMContact({ company_id, instance_id }) {
  try {
    return deleteCRMContact(company_id, instance_id);
  } catch (err) {
    console.log(err);
  }
}
