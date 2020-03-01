import React from "react";
import { Form, Field } from "react-final-form";
import { Link } from "react-router-dom";
import { InputGroup, FormControl } from "react-bootstrap";
import IosAddCircleOutline from "react-ionicons/lib/IosAddCircleOutline";
import IosSearchOutline from "react-ionicons/lib/IosSearchOutline";

import { BOOKING_STATUS } from "../booking_form";
import TextInput from "../../../../commons/form_fields/textInput";

import { getServiceList } from "../../../../remote_access/appointment/service";
import { handleListEmployees } from "../../../../remote_access/appointment/employees";

export default function FilterRowNew({ onSearch, company_id }) {
  const [state, setState] = React.useState({
    showAdvanced: false,
    services: [],
    employees: []
  });

  const toggleAdvanced = () => {
    setState(o => {
      return {
        ...o,
        showAdvanced: !o.showAdvanced
      };
    });
  };

  React.useEffect(() => {
    async function temp() {
      let servicesResult = await getServiceList({ company_id });
      let employeesResult = await handleListEmployees({ company_id });
      if (servicesResult.ok) {
        setState(o => {
          return {
            ...o,
            services: servicesResult.result.map(each => {
              return { value: each.id, label: each.name };
            })
          };
        });
      }
      if (employeesResult.ok) {
        setState(o => {
          return {
            ...o,
            employees: employeesResult.result.map(each => {
              return { value: each.id, label: each.full_name };
            })
          };
        });
      }
    }
    temp();
  }, [state.showAdvanced]);

  return (
    <Form
      onSubmit={onSearch}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <React.Fragment>
          <div className="row">
            <div className="col-3 d-flex justify-content-start">
              <Link to={`/${company_id}/appointment/addbooking`}>
                <button
                  title="Add Booking"
                  className="btn btn-primary pl-3 pr-3"
                >
                  <IosAddCircleOutline className={"icon-default icon-left"} />
                  Add Booking
                </button>
              </Link>
            </div>
            <div className="col-6 d-flex justify-content-center">
              <form onSubmit={handleSubmit}>
                <div className={"row"}>
                  <div className={"col-6 col-search-input"}>
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
                              <IosSearchOutline className={"icon-default"} />
                            </button>
                          </InputGroup.Append>
                        </InputGroup>
                      )}
                    </Field>
                  </div>
                  <div className={"col-6 col-advance-search"}>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => toggleAdvanced()}
                    >
                      Advanced Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <div className="filter-options">
                <Field name="status">
                  {({ input, meta }) => (
                    <select meta={meta} {...input}>
                      <option value="">All</option>
                      {BOOKING_STATUS.map(each => (
                        <option value={each.value} key={each.value}>
                          {each.label.toTitle()}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
            </div>
          </div>
          {state.showAdvanced && (
            <div className="row">
              <div className="col-3 d-flex justify-content-start">
                <div className="filter-options">
                  <Field name="service_bookings__service">
                    {({ input, meta }) => (
                      <select meta={meta} {...input}>
                        <option value="">Service</option>
                        {state.services.map(each => (
                          <option value={each.value} key={each.value}>
                            {each.label.toTitle()}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
              </div>
              <div className="col-3 d-flex justify-content-center">
                <div className="filter-options">
                  <Field name="service_bookings__employee">
                    {({ input, meta }) => (
                      <select meta={meta} {...input}>
                        <option value="">Employee</option>
                        {state.employees.map(each => (
                          <option value={each.value} key={each.value}>
                            {each.label.toTitle()}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
              </div>
              <div className="col-4 d-flex justify-content-center">
                <div className="row">
                  <div className="col-2">From</div>
                  <div className="col-4">
                    <Field name="booked_date_after">
                      {({ input, meta }) => (
                        <TextInput
                          type="date"
                          meta={meta}
                          {...input}
                          className={"booking-date"}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="col-2 d-flex justify-content-end">To</div>
                  <div className="col-4">
                    <Field name="booked_date_before">
                      {({ input, meta }) => (
                        <TextInput
                          type="date"
                          meta={meta}
                          {...input}
                          className={"booking-date"}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              <div className="col-2 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    />
  );
}
