import React from "react";
import { Field } from "react-final-form";
import PropTypes from "prop-types";
import Select from "react-select";
import { find } from "lodash";
import ErrorMessage from "./ErroMessage";

const SelectFieldInput = React.forwardRef((props, ref) => {
  let {
    col,
    label,
    name,
    options,
    defaultBlank,
    isSearchable,
    _onBlur,
    _onChange,
    ...attrs
  } = props;
  isSearchable = isSearchable || true;
  _onBlur = _onBlur || (() => {});
  _onChange = _onChange || (() => {});
  // options = defaultBlank
  //   ? [{ value: "", label: "--Choose--" }, ...options]
  //   : [...options];

  var parse = val => val && val.value;
  var format = val => find(options, o => o.value === val);
  if (attrs.multiple === true) {
    attrs.value = attrs.value || [];
    parse = val => {
      return val && val.map(item => item.value);
    };
    format = val =>
      val && val.map(item => find(options, o => o.value === item));
  }

  return (
    <div className={"col-" + col + " form-fields"}>
      <label>{label}</label>
      <Field
        name={name}
        parse={parse}
        format={format}
        validate={attrs.validators}
      >
        {({ input, meta }) => {
          // console.log("attrs", attrs._value, "input", input.value);
          return (
            <div onBlurCapture={_onBlur}>
              <Select
                options={options}
                ref={ref}
                isSearchable={isSearchable}
                // isDisabled={options.length <= 0}
                isOptionDisabled={option => option.disabled}
                isMulti={attrs.multiple}
                {...input}
                onChange={e => {
                  input.onChange(e);
                  _onChange(e);
                }}
                // in some cases (permission group case),
                // we are sending a custom set of values
                value={attrs._value || input.value}
              />
              {(meta.error || meta.submitError) && meta.touched &&
                <ErrorMessage meta={meta}/>
              }
            </div>
          );
        }}
      </Field>
    </div>
  );
});

SelectFieldInput.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};

export default SelectFieldInput;
