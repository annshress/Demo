import React from "react";
import { Field } from "react-final-form";
import PropTypes from "prop-types";

import Divider from "../../../commons/divider";
import TextInput from "../../../commons/form_fields/textInput";
import SelectFieldInput from "../../../commons/form_fields/selectFieldInput";
import TextArea from "../../../commons/form_fields/textArea";
import FileInput from "../../../commons/form_fields/FileInput";
import { required } from "../../../commons/validators";
import SwitchInput, {
  switchType
} from "../../../commons/form_fields/switch_input/SwitchInput";
import defaultImg from "../../../assets/img/False.jpg";

function EmployeeForm({
  employee,
  onToggle,
  handleFileChange,
  servicesOptions,
  redirectToListPage,
  isActive,
  handleIsActiveChange,
  isSendEmail,
  handleIsSendEmailChange,
  isSendSms,
  handleIsSendSmsChange
}) {
  return (
    <div className="employee_form">
      <div className="row">
        <div className="col-4">
          <Field name="is_active">
            {({ input, meta }) => (
              <SwitchInput
                label={"Status"}
                checked={isActive}
                handleChange={handleIsActiveChange}
                height={35}
                width={120}
                type={switchType.ACTIVE_INACTIVE}
              />
            )}
          </Field>
        </div>
        <div className="col-4">
          <Field name="send_email_new_booking">
            {({ input, meta }) => (
              <SwitchInput
                label={"Send email when new booking is made"}
                checked={isSendEmail}
                handleChange={handleIsSendEmailChange}
                height={35}
                width={120}
                type={switchType.YES_NO_WITH_TITLE}
              />
            )}
          </Field>
        </div>
        <div className="col-4">
          <Field name="send_sms_new_booking">
            {({ input, meta }) => (
              <SwitchInput
                label={"Send SMS when new booking is made"}
                checked={isSendSms}
                handleChange={handleIsSendSmsChange}
                height={35}
                width={120}
                type={switchType.YES_NO_WITH_TITLE}
              />
            )}
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <Field name="user.first_name" validate={required}>
            {({ input, meta }) => (
              <TextInput label="First Name" meta={meta} {...input} />
            )}
          </Field>
        </div>
        <div className="col-3">
          <Field name="user.last_name" validate={required}>
            {({ input, meta }) => (
              <TextInput label="Last Name" meta={meta} {...input} />
            )}
          </Field>
        </div>
        <div className="col-6">
          <SelectFieldInput
            label="Services"
            name="service_set"
            options={servicesOptions}
            multiple
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <Field name="user.email">
            {({ input, meta }) => (
              <TextInput label="Email" readOnly meta={meta} {...input} />
            )}
          </Field>
        </div>
        <div className="col-3">
          <Field name="user.contact" validate={required}>
            {({ input, meta }) => (
              <TextInput label="Phone" meta={meta} {...input} />
            )}
          </Field>
        </div>
        <div className="col-3">
          <Field name="company">
            {({ input, meta }) => (
              <TextInput label="Company" readOnly meta={meta} {...input} />
            )}
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <Field name="description">
            {({ input, meta }) => (
              <TextArea label="Notes" meta={meta} {...input} />
            )}
          </Field>
        </div>
        <div className="col-6">
          <Field name="user.avatar">
            {({ input, meta }) => (
              <React.Fragment>
                <FileInput
                  label="Image"
                  handleFileChange={handleFileChange}
                  children={
                    <div>
                      <img
                        src={
                          employee.user.avatar
                            ? employee.user.avatar
                            : defaultImg
                        }
                        alt=""
                        className="preview_img"
                      />
                    </div>
                  }
                  meta={meta}
                  {...input}
                />
              </React.Fragment>
            )}
          </Field>
        </div>
      </div>
      <div className="row">
        <Divider />
      </div>
      <div className="row">
        <div className="col-6 form-fields text-left">
          <button type="submit" name="" className="btn btn-primary pl-5 pr-5">
            Save
          </button>
        </div>
        <div className="col-6 form-fields text-right">
          <button
            type="button"
            name=""
            className="btn btn-outline-primary pl-3 pr-3"
            onClick={redirectToListPage}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

EmployeeForm.propTypes = {
  servicesOptions: PropTypes.array,
  employee: PropTypes.object
};

EmployeeForm.defaultProps = {
  employeesOptions: []
};

export default EmployeeForm;
