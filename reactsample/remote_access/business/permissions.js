import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchPermssionChoices(company_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}employee/${company_id}/permission_choices`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleEditPermissionGroup({ company_id, instance_id, data }) {
  try {
    return editPermissionGroup(company_id, instance_id, data);
  } catch (err) {
    console.log("error", err);
  }
}

function addPermissionGroup(company_id, data) {
  return APICaller({
    method: "POST",
    url: `${BASE_URL}employee/${company_id}/groups/`,
    data: data
  });
}

export function handleAddPermissionGroup({ company_id, data }) {
  try {
    return addPermissionGroup(company_id, data);
  } catch (e) {
    console.log("error", e);
  }
}
