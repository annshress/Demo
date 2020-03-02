import React from "react";
import ErrorMessage from "./ErroMessage";

const TextInput = React.forwardRef((props, ref) => {
  let {
    col,
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
    <div className={"col-" + col + " form-fields"}>
      {label && <label>{label}</label>}
      {title && <h6>{title}</h6>}

      <div onClick={() => onClick()}>
        <input
          {...input}
          ref={ref}
          onBlur={() => _onBlur()}
          className={className}
          type={type}
          // {...{ defaultChecked: input.value }}
          {...{ checked: input.value }}
          placeholder={placeholder}
        />
      </div>
      {(meta.error || meta.submitError) && meta.touched &&
        <ErrorMessage meta={meta}/>
      }
    </div>
  );
});

TextInput.defaultProps = {
  type: "text"
};

export default TextInput;
