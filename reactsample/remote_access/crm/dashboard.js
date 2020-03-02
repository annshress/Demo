import { BASE_URL, APICaller } from "..";

function fetchCRMDashboard(company_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/dashboard/`
  });
}

export function handleGetCRMDashboard({ company_id }) {
  try {
    return fetchCRMDashboard(company_id);
  } catch (err) {
    console.log(err);
  }
}
