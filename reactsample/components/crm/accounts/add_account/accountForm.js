import React from "react";
import { Form, Field } from "react-final-form";

import { ACCOUNT_STATUS_OPTIONS, ACCOUNT_INDUSTRY_OPTIONS } from "../constants";

import Divider from "../../../../commons/divider";
import { required } from "../../../../commons/validators";
import TextInput from "../../../../commons/form_fields/textInput";
import SelectFieldInput from "../../../../commons/form_fields/selectFieldInput";
import TextArea from "../../../../commons/form_fields/textArea";

function AccountForm(props) {
  const { account, onSubmit, onCancel, options } = props;

  return (
    <div className={'container-add-account'}>
      <Form
        initialValues={account}
        onSubmit={onSubmit}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="employee_form">
              <div className="row">
                <div className="col-4">
                  <div className="row">
                    <Field name="name" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          col="12"
                          label="Name"
                          placeholder="Name"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <Field name="website" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          col="12"
                          label="Website"
                          placeholder="http://www.whyunified.com"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <Field name="phone" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          col="12"
                          label="Phone"
                          placeholder="+999999999999"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <Field name="email" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          col="12"
                          type="email"
                          label="Email"
                          placeholder="abc@xyz.com"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <SelectFieldInput
                      name="leads"
                      col="12"
                      label="Leads"
                      options={options.leadOptions}
                      multiple={true}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <Field
                      name="billing_address.address_line"
                      validate={required}
                    >
                      {({ input, meta }) => (
                        <TextInput
                          col="12"
                          label="Billing Address"
                          placeholder="Address Line"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <Field
                          name="billing_address.street"
                          validate={required}
                        >
                          {({ input, meta }) => (
                            <TextInput
                              col="12"
                              label="Street"
                              placeholder="Street"
                              meta={meta}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <Field name="billing_address.postcode">
                          {({ input, meta }) => (
                            <TextInput
                              col="12"
                              label="PostCode"
                              placeholder="PostCode"
                              meta={meta}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <Field name="billing_address.city" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          col="6"
                          label="City"
                          placeholder="City"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                    <Field name="billing_address.state">
                      {({ input, meta }) => (
                        <TextInput
                          col="6"
                          label="State"
                          placeholder="State"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <Field name="billing_address.country" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          col="12"
                          label="Country"
                          placeholder="Country"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="row">
                    <SelectFieldInput
                      name="contacts"
                      col="12"
                      label="Contacts"
                      options={options.contactOptions}
                      multiple={true}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <SelectFieldInput
                      name="status"
                      col="12"
                      label="Status"
                      options={ACCOUNT_STATUS_OPTIONS}
                      multiple={false}
                    />
                  </div>
                  <div className="row">
                    <SelectFieldInput
                      name="industry"
                      col="12"
                      label="Industry"
                      options={ACCOUNT_INDUSTRY_OPTIONS}
                      multiple={false}
                    />
                  </div>
                  <div className="row">
                    <Field name="account_tags">
                      {({ input, meta }) => (
                        <TextArea
                          col="12"
                          label="Tags"
                          placeholder="Add comma-separated tags"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              {account && account.created_by &&
                <React.Fragment>
                  <div className="row">
                    <div className="col-12">
                      <Divider type="blank" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      Last updated by "{account.created_by.name}" on{" "}
                      {new Date(account.created_on).toString()}
                    </div>
                  </div>
                </React.Fragment>
              }
              <div className="row">
                <Divider />
              </div>
              <div className="row">
                <div className="col-6 form-fields text-left">
                  <button type="submit" name="" className={'btn btn-primary pl-5 pr-5'}>
                    Save
                  </button>
                </div>
                <div className="col-6 form-fields text-right">
                  <button type="button" name="" className="btn btn-outline-primary pl-3 pr-3" onClick={() => onCancel()}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
}

export default AccountForm;
