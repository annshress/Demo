import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCRMAccounts(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/accounts/?${queryString}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
