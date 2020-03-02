import React from "react";
import {FormControl} from "react-bootstrap";

import ErrorMessage from "../ErroMessage";

const FormControlInput = React.forwardRef((props, ref) => {
  let {
    label,
    title,
    className,
    type,
    placeholder,
    onClick,
    _onBlur,
    meta,
    ...input
  } = props;

  onClick = onClick || (() => {});
  _onBlur = _onBlur || (() => {});

  return (
    <div className={"form-fields"}>
      {label && <label>{label}</label>}
      {title && <h6>{title}</h6>}

      <div onClick={() => onClick()}>
        <FormControl
          {...input}
          ref={ref}
          onBlur={() => _onBlur()}
          className={className}
          placeholder={placeholder}
        />
      </div>
      {(meta.error || meta.submitError) && meta.touched &&
        <ErrorMessage meta={meta}/>
      }
    </div>
  );
});

FormControlInput.defaultProps = {
  type: "text"
};

export default FormControlInput;
