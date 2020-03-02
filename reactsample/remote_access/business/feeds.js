import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchFeed(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/feed/?${queryString}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

function fetchCompanyDashboardContent(company_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}company/${company_id}/dashboard/`
  });
}

export function handleFetchCompanyDashboardContent({ company_id }) {
  try {
    return fetchCompanyDashboardContent(company_id);
  } catch (e) {
    console.log(e);
  }
}
