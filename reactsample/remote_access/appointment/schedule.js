import { BASE_URL, APICaller, objToQueryString } from "..";

// function that makes the api request and returns a Promise for response
function fetchSchedules(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}appointments/${company_id}/schedule/?${queryString}`
  });
}

export default function handleSchedules({ company_id, ...params }) {
  const queryString = objToQueryString(params);
  try {
    return fetchSchedules(company_id, queryString);
  } catch (err) {
    console.log("error", err);
  }
}
