import { BASE_URL, APICaller } from "..";

function fetchWorkingTime(company_id, employee_id) {
  const url = employee_id
    ? `${BASE_URL}appointments/${company_id}/working_time/${employee_id}`
    : `${BASE_URL}appointments/${company_id}/working_time/`;
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

export function handleDeleteWorkingTime({ company_id, instance_id }) {
  try {
    return deleteWorkingTime(company_id, instance_id);
  } catch (err) {
    console.log("error", err);
  }
}
