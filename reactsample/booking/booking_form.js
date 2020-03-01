import React, { useState, useEffect } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { withRouter } from "react-router-dom";

import TextInput from "../../../commons/form_fields/textInput";
import SelectFieldInput from "../../../commons/form_fields/selectFieldInput";
import Divider from "../../../commons/divider";
import { required } from "../../../commons/validators";
import { PaymentChoices } from "../../business/constants";

import {
  getServiceList,
  handleGetEmployeeTimes
} from "../../../remote_access/appointment/service";
import { handleListEmployees } from "../../../remote_access/appointment/employees";

import MdTime from "react-ionicons/lib/MdTime";
import IosTrashOutline from "react-ionicons/lib/IosTrashOutline";

export const BOOKING_STATUS = [
  { label: "pending", value: 0 },
  { label: "confirmed", value: 1 },
  { label: "cancelled", value: 2 }
];

export function getBookingStatusDisplay(value) {
  return BOOKING_STATUS.filter(each => each.value === value)[0].label;
}

function BookingForm(props) {
  let {
    booking,
    push,
    pop,
    company_id,
    deleteServiceBooking,
    ...attrs
  } = props;

  const [options, setOptions] = useState({
    status: BOOKING_STATUS,
    payment: PaymentChoices,
    services: [],
    employees: [],
    employeeOptions: [],
    timeOptions: [],
    employeeTimesOptions: []
  });

  const [refs, setRefs] = useState({
    serviceRef: [],
    dateRef: [],
    employeeRef: []
  });

  const appendRefs = () => {
    // these are the service-bookings array refs
    setRefs(re => {
      return {
        serviceRef: [...re.serviceRef, React.createRef(null)],
        dateRef: [...re.dateRef, React.createRef(null)],
        employeeRef: [...re.employeeRef, React.createRef(null)]
      };
    });
  };

  const removeRefs = index => {
    setRefs(re => {
      return {
        serviceRef: re.serviceRef.filter((val, ind) => index !== ind),
        dateRef: re.dateRef.filter((val, ind) => index !== ind),
        employeeRef: re.employeeRef.filter((val, ind) => index !== ind)
      };
    });
  };

  // during EDIT, we need to pre-populate refs for pre-existing service-bookings
  const prePopulateRefs = () => {
    const refLength = booking.service_bookings.length;
    const preRefs = {
      serviceRef: Array(refLength).fill(React.createRef(null)),
      dateRef: Array(refLength).fill(React.createRef(null)),
      employeeRef: Array(refLength).fill(React.createRef(null))
    };
    console.log(preRefs);
    setRefs(re => preRefs);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => prePopulateRefs(), [booking.service_bookings]);

  deleteServiceBooking = deleteServiceBooking || function() {};

  const getEmployees = async index => {
    if (!refs.dateRef[index].current.value){
      return;
    }

    if (!refs.serviceRef[index].current.select.state.focusedOption) {
      return;
    }

    let showableEmployeesTimes = await handleGetEmployeeTimes({
      company_id: company_id,
      service_id:
        refs.serviceRef[index].current.select.state.focusedOption.value,
      date: refs.dateRef[index].current.value
    });

    if (showableEmployeesTimes.ok) {
      const showableEmployees = showableEmployeesTimes.result
        .map(et => Object.keys(et))
        .map(e => e[0]);
      setOptions(o => {
        return {
          ...o,
          employeeOptions: o.employees.filter(
            emp => showableEmployees.indexOf(String(emp.value)) >= 0
          ),
          employeeTimesOptions: showableEmployeesTimes.result
        };
      });
    }
  };

  const getEmployeeTimes = async index => {
    if (attrs.instance_id) {
      return;
    }

    let allTimesObj = null;
    let allTimesArr = [];

    const filteredOptions = options.employeeTimesOptions.filter(t => {
      return (
        // eslint-disable-next-line eqeqeq
        Object.keys(t)[0] == refs.employeeRef[index].current.select.state.focusedOption.value
      );
    });

    if (refs.employeeRef[index].current.select.state.focusedOption) {
      allTimesObj =
        filteredOptions[0][
          refs.employeeRef[index].current.select.state.focusedOption.value
        ];
    }

    if (allTimesObj) {
      allTimesArr = Object.entries(allTimesObj).sort();
    }

    setOptions(o => {
      return {
        ...o,
        timeOptions: allTimesArr.map(time => {
          return { label: time[0], value: time[0], disabled: !time[1] };
        })
      };
    });
  };

  useEffect(() => {
    async function getFormOptions() {
      let servicesResult = await getServiceList({ company_id });
      let employeesResult = await handleListEmployees({ company_id });
      if (servicesResult.ok && employeesResult.ok) {
        setOptions(o => {
          return {
            ...o,
            services: servicesResult.result.map(each => {
              return { value: each.id, label: each.name };
            }),
            employees: employeesResult.result.map(each => {
              return { value: each.id, label: each.full_name };
            })
          };
        });
      }
    }
    getFormOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gotoBack = () =>{
    props.history.push(`/${props.company_id}/appointment/managebooking`);
  };

  return (
    <div className="inner_page_content">
      {/* <!---Booking Graph----> */}
      <div className="employee_form">
        {booking.created_at && (
          <React.Fragment>
            <div className="row row-booking_detail">
              <div className="col-4">
                <h6>Created:</h6>
                <p>{booking.created_at}</p>
              </div>
              <div className="col-4">
                <h6>Client:</h6>
                <p>{booking.client.name}</p>
              </div>
              <div className="col-4">
                <h6>Email:</h6>
                <p>{booking.client.email}</p>
              </div>
              {/* <div className="col-3">
              <h6>IP Address</h6>
              <p>94.190.193.52</p>
            </div> */}
            </div>
            <div className="row">
              <Divider />
            </div>
          </React.Fragment>
        )}
        <div className="row">
          <Field name="booking_id" validate={required}>
            {({ input, meta }) => (
              <TextInput col="4" label="Unique ID" meta={meta} {...input} />
            )}
          </Field>
          <SelectFieldInput
            name="status"
            col="4"
            label="Status"
            options={options.status}
          />
          <SelectFieldInput
            name="payment"
            col="4"
            label="Payment Method"
            options={options.payment}
          />
        </div>
        <div className="row">
          <Divider />
        </div>
        <div className="row">
          <div className="col-12 form-fields">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                appendRefs();
                push("service_bookings", undefined);
              }}
            >
              <MdTime className={"icon-primary icon-left"} />
              Add Service Booking
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 service-row">
            <table width="100%">
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Service</th>
                  <th style={{ width: "25%" }}>Booked Date</th>
                  <th style={{ width: "25%" }}>Employee</th>
                  <th style={{ width: "12%" }}>Start Time</th>
                  <th style={{ width: "10%" }} />
                </tr>
              </thead>
            </table>
            <FieldArray name="service_bookings">
              {({ fields }) => {
                return fields.map((name, index) => {
                  return (
                    <div key={name} className="row row-service-bookings">
                      <SelectFieldInput
                        name={`${name}.service`}
                        ref={refs.serviceRef[index]}
                        col="3"
                        defaultBlank={true}
                        options={options.services}
                      />
                      <Field name={`${name}.booked_date`}>
                        {({ input, meta }) => (
                          <TextInput
                            col="3"
                            ref={refs.dateRef[index]}
                            type="date"
                            _onBlur={() => getEmployees(index)}
                            meta={meta}
                            {...input}
                            className={"booking-date"}
                          />
                        )}
                      </Field>
                      <SelectFieldInput
                        name={`${name}.employee`}
                        ref={refs.employeeRef[index]}
                        isSearchable={false}
                        _onBlur={() => getEmployeeTimes(index)}
                        col="3"
                        defaultBlank={true}
                        options={
                          attrs.instance_id
                            ? options.employeeOptions.length
                              ? options.employeeOptions
                              : options.employees
                            : options.employeeOptions
                        }
                      />
                      {attrs.instance_id ? (
                        <Field name={`${name}.start_time`}>
                          {({ input, meta }) => (
                            <TextInput
                              col="2"
                              placeholder="Time"
                              meta={meta}
                              {...input}
                              className={"start-time"}
                            />
                          )}
                        </Field>
                      ) : (
                        <SelectFieldInput
                          name={`${name}.start_time`}
                          col="2"
                          defaultBlank={true}
                          options={options.timeOptions}
                          className={"start-time"}
                        />
                      )}

                      <span
                        id={name}
                        onClick={() => {
                          if (fields.value[index])
                            deleteServiceBooking(fields.value[index].id);
                          fields.remove(index);
                          removeRefs(index); // delete the refs as well
                        }}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          padding: "10px 5px"
                        }}
                        title="Delete"
                      >
                        <IosTrashOutline className={"icon-secondary"} />
                      </span>
                    </div>
                  );
                });
              }}
            </FieldArray>
          </div>
        </div>
        <div className="row">
          <Divider />
        </div>
        <div className="row">
          {/* {booking.service_bookings !== [] ? (
            <ListTable
              headers={headers}
              results={booking.service_bookings || []}
            />
          ) : (
            undefined
          )} */}
          <div className="col-6 form-fields text-left">
            <button type="submit" className="btn btn-primary pl-5 pr-5">
              Save
            </button>
          </div>
          <div className="col-6 form-fields text-right">
            <button name="" className="btn btn-outline-primary pl-3 pr-3" onClick={gotoBack}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

BookingForm.propTypes = {};

export default withRouter(BookingForm);
