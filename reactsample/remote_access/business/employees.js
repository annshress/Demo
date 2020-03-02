import { BASE_URL, APICaller, objToQueryString } from "..";

// function that makes the api request and returns a Promise for response
function fetchEmployees(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}employee/${company_id}/?${queryString}`
  });
}

function fetchEmployee(company_id, instance_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}employee/${company_id}/${instance_id}/`
  });
}

function editEmployee(company_id, instance_id, data) {
  return APICaller({
    method: "PATCH",
    url: `${BASE_URL}employee/${company_id}/${instance_id}/`,
    data: data
  });
}

// function addEmployee(company_id, data) {
//   return APICaller({
//     method: "POST",
//     url: `${BASE_URL}appointments/${company_id}/services/`,
//     data: data
//   });
// }

export function handleListEmployees({ company_id, ...params }) {
  const queryString = objToQueryString(params);
  try {
    return fetchEmployees(company_id, queryString);
  } catch (err) {
    console.log("error", err);
  }
}

export function handleEditEmployee({ company, instance_id, data }) {
  try {
    return editEmployee(company, instance_id, data);
  } catch (err) {
    console.log("error", err);
  }
}

// export function handleAddEmployee({ company, data }) {
//   try {
//     return addEmployee(company, data);
//   } catch (err) {
//     console.log("error", err);
//   }
// }

export function handleGetEmployee({ company_id, instance_id }) {
  try {
    return fetchEmployee(company_id, instance_id);
  } catch (err) {
    console.log("error", err);
  }
}
