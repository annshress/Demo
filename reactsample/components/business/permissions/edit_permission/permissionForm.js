/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Field } from "react-final-form";

import TextInput from "../../../../commons/form_fields/textInput";
import Divider from "../../../../commons/divider";
import SelectFieldInput from "../../../../commons/form_fields/selectFieldInput";
import { required } from "../../../../commons/validators";

import { handleFetchPermissionChoices } from "../../../../remote_access/business/permissions";
import { handleListEmployees } from "../../../../remote_access/appointment/employees";

function PermissionForm(props) {
  const { company_id, onCancel, selectedOptions, onOptionChange } = props;

  const [options, setOptions] = React.useState({
    permissions: [],
    selectedCategory: null,
    displayPermissions: [],
    employees: []
  });

  React.useEffect(() => {
    const getOptions = async () => {
      const response = await handleFetchPermissionChoices({
        company_id: company_id
      });
      if (response.ok) {
        setOptions(old => {
          return {
            ...old,
            permissions: response.result,
            displayPermissions: response.result[Object.keys(response.result)[0]]
          };
        });
      } else {
        console.log(response);
      }

      const employeeResponse = await handleListEmployees({
        company_id: company_id
      });
      if (employeeResponse.ok) {
        setOptions(old => {
          return {
            ...old,
            employees: employeeResponse.result.map(each => {
              return { label: each.full_name, value: each.id };
            })
          };
        });
      } else {
        console.log(employeeResponse);
      }
    };
    getOptions();
  }, []);

  const getCategories = () => {
    return Object.keys(options.permissions);
  };

  const getPermissionOptions = e => {
    setOptions(old => {
      return {
        ...old,
        selectedCategory: e.target.value,
        displayPermissions: old.permissions[e.target.value]
      };
    });
    e.persist();
  };

  const changeHandler = values => {
    onOptionChange(options.selectedCategory, values);
  };

  return (
    <div className="employee_form">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <Field name="name" validate={required}>
              {({ input, meta }) => (
                <TextInput
                  col="6"
                  label="Permission Name"
                  meta={meta}
                  {...input}
                />
              )}
            </Field>
            <div className={"col-6 form-fields"}>
              <label>Application</label>
              <select name="category" onChange={getPermissionOptions}>
                <option value={null}>--Choose--</option>
                {getCategories().map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <SelectFieldInput
              name="permissions"
              col="12"
              label="Permissions"
              options={options.displayPermissions}
              multiple={true}
              _onChange={changeHandler}
              // get values from state-stored selected options
              _value={selectedOptions[options.selectedCategory]}
            />

            <SelectFieldInput
              name="employee_set"
              col="12"
              label="Employees"
              options={options.employees}
              multiple={true}
            />

            <h4>Selected Options</h4>
            <Divider type="blank" />

            {Object.keys(selectedOptions).map(key => (
              <li key={key}>
                <strong>{key}</strong> :
                {selectedOptions[key].map(z => (
                  <span key={z.value}>{z.label} | </span>
                ))}
              </li>
            ))}

            <Divider />
            <div className="col-6 form-fields text-left">
              <button type="submit" name="" className="button">
                Save
              </button>
            </div>
            <div className="col-6 form-fields text-right">
              <button
                type="button"
                name=""
                className="btn btn-outline-primary"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionForm;
