////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


export function handleEditOption({ company_id, data }) {
  try {
    return editOption(company_id, data);
  } catch (err) {
    console.log("error", err);
  }
}
