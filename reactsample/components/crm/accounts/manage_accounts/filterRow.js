import React from "react";
import { Form, Field } from "react-final-form";
import { Link } from "react-router-dom";
import IosAddCircleOutline from "react-ionicons/lib/IosAddCircleOutline";
import IosSearchOutline from "react-ionicons/lib/IosSearchOutline";
import {FormControl, InputGroup} from "react-bootstrap";


export default function FilterRow({ company_id, onSearch }) {
  return (
    <Form
      onSubmit={onSearch}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <div className="filter_row">
          <div className="row">
            <div className="col-3">
              <Link to={`/${company_id}/crm/add-account/`}>
                <button
                  href="#"
                  title="Add Account"
                  className="btn btn-primary pl-5 pr-5"
                >
                  <IosAddCircleOutline className={'icon-default icon-left'}/>
                  Add Account
                </button>
              </Link>
            </div>
            <div className="col-6">
              <form onSubmit={handleSubmit} className={'form-search'}>
                <Field name="q">
                  {({ input, meta }) => (
                    <InputGroup className="mb-3">
                      <FormControl
                        className="search_field"
                        placeholder="Search here..."
                        meta={meta}
                        {...input}
                      />
                      <InputGroup.Append>
                        <button type="submit" className="btn btn-primary">
                          <IosSearchOutline className={'icon-default'}/>
                        </button>
                      </InputGroup.Append>
                    </InputGroup>
                  )}
                </Field>
              </form>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <div className="filter-options">
                <Field name="status">
                  {({ input, meta }) => (
                    <select meta={meta} {...input} aria-label="Status">
                      <option value="">All</option>
                      <option value="1">Active</option>
                      <option value="2">Inactive</option>
                    </select>
                  )}
                </Field>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
