import React from "react";
import { Field } from "react-final-form";

import TextInput from "../../../commons/form_fields/textInput";
import SelectFieldInput from "../../../commons/form_fields/selectFieldInput";
import Divider from "../../../commons/divider";
import TextArea from "../../../commons/form_fields/textArea";

function ClientForm({ validate }) {
  const countryOptions = [
    { label: "---Choose---", value: "" },
    { label: "USA", value: "usa" },
    { label: "Canada", value: "canada" },
    { label: "Australia", value: "australia" },
    { label: "Nepal", value: "nepal" },
    { label: "Pakistan", value: "pakistan" },
    { label: "India", value: "india" }
  ];

  return (
    <div className="inner_page_content">
      {/* <!---Booking Graph----> */}
      <div className="employee_form">
        <div className="row">
          <Field name="client.name">
            {({ input, meta }) => (
              <TextInput col="6" label="Name" meta={meta} {...input} />
            )}
          </Field>
          <Field name="client.email">
            {({ input, meta }) => (
              <TextInput col="6" label="Email" meta={meta} {...input} />
            )}
          </Field>
          <Divider type="blank" />
          <Field name="client.contact">
            {({ input, meta }) => (
              <TextInput col="4" label="Phone" meta={meta} {...input} />
            )}
          </Field>
          <Field name="client.address_one">
            {({ input, meta }) => (
              <TextInput
                col="4"
                label="Address Line 1"
                meta={meta}
                {...input}
              />
            )}
          </Field>
          <Field name="client.address_two">
            {({ input, meta }) => (
              <TextInput
                col="4"
                label="Address Line 2"
                meta={meta}
                {...input}
              />
            )}
          </Field>
          <Divider type="blank" />

          <SelectFieldInput
            name="client.country"
            col="3"
            label="Country"
            options={countryOptions}
          />
          <Field name="client.state">
            {({ input, meta }) => (
              <TextInput col="3" label="State" meta={meta} {...input} />
            )}
          </Field>
          <Field name="client.city">
            {({ input, meta }) => (
              <TextInput col="3" label="City" meta={meta} {...input} />
            )}
          </Field>

          <Field name="client.zip">
            {({ input, meta }) => (
              <TextInput col="3" label="Zip" meta={meta} {...input} />
            )}
          </Field>
          <Divider type="blank" />

          <Field name="client.notes">
            {({ input, meta }) => (
              <TextArea col="12" label="Notes" meta={meta} {...input} />
            )}
          </Field>

          <Divider type="blank" />

          <div className="col-6 form-fields text-left">
            <button name="" className="btn btn-primary pl-5 pr-5">
              Save
            </button>
          </div>
          <div className="col-6 form-fields text-right">
            <button name="" className="btn btn-outline-secondary pl-3 pl-3">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientForm;
