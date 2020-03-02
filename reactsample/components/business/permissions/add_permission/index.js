import React from "react";
import { Form } from "react-final-form";

import PermissionForm from "../edit_permission/permissionForm";

import Content from "../../../layouts/content";

import { handleAddPermissionGroup } from "../../../../remote_access/business/permissions";

function AddPermission(props) {
  const { company } = props.match.params;

  const [selectedOptions, setOptions] = React.useState({});

  const onSubmit = async values => {
    const permissions = Object.values(selectedOptions)
      .reduce((f, each) => [...f, ...each], [])
      .map(each => each.value);
    values = { ...values, permissions };
    console.log(values);
    const response = await handleAddPermissionGroup({
      company_id: company,
      data: values
    });
    if (response.ok) {
      props.history.push(`/${company}/business/permissions/`);
    } else {
      return response;
    }
  };

  const onCancel = () => {
    props.history.push(`/${company}/business/permissions/`);
  };

  const onOptionChange = (category, options) => {
    setOptions(old => {
      return {
        ...old,
        [category]: options
      };
    });
  };

  return (
    <div className="App">
      <Content>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <PermissionForm
                company_id={company}
                onCancel={onCancel}
                selectedOptions={selectedOptions}
                onOptionChange={onOptionChange}
              />
            </form>
          )}
        />
      </Content>
    </div>
  );
}

export default AddPermission;
