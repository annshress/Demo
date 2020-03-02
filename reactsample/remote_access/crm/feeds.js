import { BASE_URL, APICaller, objToQueryString } from "..";

function fetchAppFeed(company_id, app_label, queryString) {
  const url =
    app_label.length >= 1
      ? `${BASE_URL}crm/${company_id}/feed/${app_label}/?${queryString}`
      : `${BASE_URL}crm/${company_id}/feed/?${queryString}`;
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


export function handleLoveFeedComment({ company_id, instance_id }) {
  try {
    return loveComment(company_id, instance_id);
  } catch (e) {
    console.log(e);
  }
}

function loveFeed(company_id, instance_id) {
  return APICaller({
    method: "POST",
    url: `${BASE_URL}feed/${company_id}/${instance_id}/love/`
  });
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function handleLoadMoreComments({
  company_id,
  action_id,
  limit,
  offset
}) {
  try {
    return loadMoreComments(company_id, action_id, limit, offset);
  } catch (e) {
    console.log(e);
  }
}
