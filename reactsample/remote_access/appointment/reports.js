////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

export function handleServiceReport({ company_id, ...params }) {
  const queryString = objToQueryString(params);
  try {
    return fetchServieReport(company_id, queryString);
  } catch (err) {
    console.log("error", err);
  }
}
