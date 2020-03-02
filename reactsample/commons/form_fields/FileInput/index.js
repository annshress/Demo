import React from "react";
import IosArrowDropup from "react-ionicons/lib/IosArrowDropup";
import ErrorMessage from "../ErroMessage";

const FileInput = React.forwardRef((props, ref) => {
  const {
    col,
    label,
    labelText,
    className,
    type,
    children,
    placeholder,
    handleFileChange,
    meta,
    ...input
  } = props;
  const [value, setValue] = React.useState(null);

  input.value = undefined; // prevents raising unsecure operation on form submission.

  input.onChange = e => {
    if (handleFileChange) {
      handleFileChange(e);
    }
    setValue(e.target.files[0].name);
  };

  return (
    <div className={"form-fields"}>
      {label && <label>{label}</label>}
      <div id="preview">{children}</div>
      <input
        id={"file_upload_" + label}
        className={className}
        type={type}
        ref={ref}
        // onChange={handleFileChange}
        placeholder={placeholder}
        {...input}
      />

      <label htmlFor={"file_upload_" + label}>
        <IosArrowDropup className={"icon-primary icon-left"} />
        {props.labelText}
      </label>
      {value && <div className={"pl-1"}>{value}</div>}
      {(meta.error || meta.submitError) && meta.touched && (
        <ErrorMessage meta={meta} />
      )}
    </div>
  );
});

FileInput.defaultProps = {
  type: "file",
  className: "img_upload",
  labelText: "Select File"
};

export default FileInput;
