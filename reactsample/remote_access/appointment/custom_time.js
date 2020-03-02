import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCustomTimes(company_id, employee_id, queryString) {
  const url = employee_id
    ? `${BASE_URL}appointments/${company_id}/custom_times/${employee_id}/?${queryString}`
    : `${BASE_URL}appointments/${company_id}/custom_times/?${queryString}`;
  return APICaller({
    method: "GET",
    url: url
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleDeleteCustomTime({
  company_id,
  employee_id,
  instance_id
}) {
  try {
    return deleteCustomTime(company_id, employee_id, instance_id);
  } catch (err) {
    console.log("error", err);
  }
}
