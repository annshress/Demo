import React,{useState} from "react";
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";

import TextInput from "../../../../commons/form_fields/textInput";
import TextArea from "../../../../commons/form_fields/textArea";
import SwitchInput, {switchType} from "../../../../commons/form_fields/switch_input/SwitchInput";
import Divider from "../../../../commons/divider";

function NotificationEmailForm(props) {
  const {
    emailFlagKey,
    emailSubjectKey,
    emailBodyKey,
    notifications,
    onSubmit
  } = props;

  return (
      <Form
        initialValues={notifications}
        onSubmit={onSubmit}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 form-fields">
                <Field name={emailFlagKey}>
                  {({ input, meta }) => (
                    <SwitchInput
                      height={35}
                      width={120}
                      type={switchType.YES_NO_WITH_TITLE}
                      label="Send this message"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-12 form-fields">
                <Field name={emailSubjectKey}>
                  {({ input, meta }) => (
                    <TextInput
                      label="Subject"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="row">
              <Field name={emailBodyKey}>
                {({ input, meta }) => (
                  <TextArea
                    col="12"
                    className="tinMCE"
                    label="Message"
                    meta={meta}
                    {...input}
                  />
                )}
              </Field>

              {/* <textarea
                className="tinMCE"
                id="mce_0"
                // style={{ display: "none" }}
                aria-hidden="true"
              /> */}

              {/* the below div belongs here */}
            </div>
            <div className={'row'}>
              <Divider type={'with_border'}/>
            </div>
            <div className="row">
              <div className="col-6 form-fields text-left">
                <button name="" className="btn btn-primary pl-5 pr-5" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      />
  );
}

NotificationEmailForm.propTypes = {
  emailFlagKey: PropTypes.string.isRequired,
  emailSubjectKey: PropTypes.string.isRequired,
  emailBodyKey: PropTypes.string.isRequired
};

export default NotificationEmailForm;
