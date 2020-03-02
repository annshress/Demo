import React from "react";
import ErrorMessage from "./ErroMessage";

function TextArea({ col, label, meta, ...input }) {
  return (
    <div className={"col-" + col + " form-fields"}>
      <label>{label}</label>
      <textarea {...input} />
      {(meta.error || meta.submitError) && meta.touched &&
        <ErrorMessage meta={meta}/>
      }
    </div>
  );
}

export default TextArea;
