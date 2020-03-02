import { BASE_URL, APICaller, objToQueryString } from "..";

// function that makes the api request and returns a Promise for response
function fetchPublicServices(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}appointments/${company_id}/public/services/?${queryString}`
  });
}

function fetchServices(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}appointments/${company_id}/services/?${queryString}`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function handleGetService({ company_id, instance_id }) {
  try {
    return fetchService(company_id, instance_id);
  } catch (err) {
    console.log("error", err);
  }
}

export function handleDeleteService({ company_id, instance_id }) {
  try {
    return deleteService(company_id, instance_id);
  } catch (err) {
    console.log("error", err);
  }
}

export function handleGetEmployeeTimes({ company_id, service_id, date }) {
  try {
    return getEmployeeTimes(company_id, service_id, date);
  } catch (err) {
    console.log("error", err);
  }
}
