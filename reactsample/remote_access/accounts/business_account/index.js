import { BASE_URL, APICaller } from "../..";

////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function HandleUpdateSecurityAnswer(company, data) {
  try {
    return updateSecurityQuestionAnswer(
      company.company,
      company.user.id,
      company.data
    );
  } catch (err) {
    console.log("error", err);
  }
}
function checkifSecurityQuestionExist(company_id, instance_id) {
  return APICaller({
    method: "GET",
    url: `${BASE_URL}api/user/${company_id}/getquestion/${instance_id}`
  });
}

export function handleCheckSecurityQuestion(company, user) {
  try {
    return checkifSecurityQuestionExist(company.company, company.user.id);
  } catch (err) {
    console.log("error", err);
  }
}
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
