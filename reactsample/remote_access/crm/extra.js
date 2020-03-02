import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchCRMComments(company_id, queryString) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}crm/${company_id}/extras/comments/?${queryString}`
  });
}

export function handleGetCRMComments({ company_id, ...params }) {
  const queryString = objToQueryString(params);
  try {
    return fetchCRMComments(company_id, queryString);
  } catch (err) {
    console.log(err);
  }
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function handleEditCRMComment({ company_id, instance_id, data }) {
  try {
    return editCRMComment(company_id, instance_id, data);
  } catch (err) {
    console.log(err);
  }
}

function deleteCRMComment(company_id, instance_id) {
  return APICaller({
    method: "DELETE",
    url: `${BASE_URL}crm/${company_id}/extras/comments/${instance_id}/`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

function deleteCRMAttachment(company_id, instance_id) {
  return APICaller({
    method: "DELETE",
    url: `${BASE_URL}crm/${company_id}/extras/attachments/${instance_id}/`
  });
}

export function handleDeleteCRMAttachment({ company_id, instance_id }) {
  try {
    return deleteCRMAttachment(company_id, instance_id);
  } catch (e) {
    console.log(e);
  }
}
