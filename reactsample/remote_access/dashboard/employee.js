import { BASE_URL, APICaller } from "..";

function addEmployee(company_id, data) {
  return APICaller({
    method: "POST",
    url: `${BASE_URL}company/${company_id}/add_employee/`,
    data: data
  });
}

export function handleAddEmployee({ company, data }) {
  try {
    return addEmployee(company, data);
  } catch (err) {
    console.log("error", err);
  }
}
