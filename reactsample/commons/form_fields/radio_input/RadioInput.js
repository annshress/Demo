import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

function RadioInput(props) {
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

  return (
    <React.Fragment>
      <div className="material-radio form-fields" onClick={() => onClick()}>
        <input
          type="radio"
          name={props.name}
          id={props.name}
          value={props.value}
          onChange={() => {}}
          {...props}
        />
        <label htmlFor={props.name}>{props.label}</label>
      </div>

      {/*Workable version without any styling*/}
      {/* Todo: bring back this codes with styling*/}
      {/*<input*/}
      {/*  name={input.name}*/}
      {/*  type="radio"*/}
      {/*  value={input.value}*/}
      {/*  checked={input.checked}*/}
      {/*  onChange={input.onChange}/>*/}
      {/*<label htmlFor={props.name} className={'pl-4'}>{props.label}</label>*/}
    </React.Fragment>
  );
}

RadioInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string
};

export default RadioInput;
