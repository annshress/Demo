import React from "react";
import { Form, Field } from "react-final-form";
import { Link } from "react-router-dom";

import TextInput from "../../../../commons/form_fields/textInput";

function FilterRow(props) {
  const { company_id, onSearch } = props;

  return (
    <Form
      onSubmit={onSearch}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <div className="filter_row">
          <div className="row">
            <div className="col-3">
              <Link to={`/${company_id}/business/permissions/add/`}>
                <button
                  href="#"
                  title="Add Permission"
                  className="button red icon_plus"
                >
                  Add Permission
                </button>
              </Link>
            </div>
            <div className="col-6">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-10">
                    <div className="table_search">
                      <Field name="q">
                        {({ input, meta }) => (
                          <TextInput
                            className="search_field"
                            placeholder="Search here..."
                            meta
                            {...input}
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                  <div className="col-2">
                    <button type="submit" name="" className="search_button" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default FilterRow;
