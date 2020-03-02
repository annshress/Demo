import React from "react";

function ErrorMessage(props) {
  let error = props.meta.error || props.meta.submitError;
  let errorContent = '';

  if (Array.isArray(error)){
    errorContent= error.map((item, index)=>{
      return(
        <li key={index}>
          <span className="error">{item.toString().replace("['",'').replace("']",'')}</span>
        </li>
      )
    });
  } else{
    errorContent = (
      <span className="error">{error}</span>
    )
  }

  return(
    <div className={'container-field-error'}>
      <ul>
        {errorContent}
      </ul>
    </div>
  )
}

export default ErrorMessage;
