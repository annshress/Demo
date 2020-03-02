import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../utils/validators";

function ChangePasswordForm(props) {
  const { onSubmit } = props;

  return (
    <div>
      <div>Please enter your new password to reset.</div>
      <br />
      <Form
        onSubmit={onSubmit}
        render={({
          submitError,
          handleSubmit,
          reset,
          submitting,
          pristine,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            <Field name="old_password" validate={required}>
              {({ input, meta }) => (
                <TextInput
                  col="6"
                  type="password"
                  placeholder="Old Password"
                  meta={meta}
                  {...input}
                />
              )}
            </Field>
            <Field name="password" validate={required}>
              {({ input, meta }) => (
                <TextInput
                  col="6"
                  type="password"
                  placeholder="New Password"
                  meta={meta}
                  {...input}
                />
              )}
            </Field>
            <Field name="password2" validate={required}>
              {({ input, meta }) => (
                <TextInput
                  col="6"
                  type="password"
                  placeholder="Confirm Password"
                  meta={meta}
                  {...input}
                />
              )}
            </Field>

            {submitError && <span className="error">{submitError}</span>}

            <br />
            <button type="submit" className={'button active medium'}>Submit</button>
          </form>
        )}
      />
    </div>
  );
}

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ChangePasswordForm;
