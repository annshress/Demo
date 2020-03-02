/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Form } from "react-final-form";

import PermissionForm from "./permissionForm";
import {
  handleFetchPermissionGroup,
  handleEditPermissionGroup
} from "../../../../remote_access/business/permissions";
import Content from "../../../layouts/content";

function EditPermission(props) {
  const { company, id } = props.match.params;

  const [instance, setInstance] = React.useState({});
  const [selectedOptions, setOptions] = React.useState({});

  React.useEffect(() => {
    const getPermission = async () => {
      const response = await handleFetchPermissionGroup({
        company_id: company,
        instance_id: id
      });
      if (response.ok) {
        setInstance(response.result);
        setOptions(response.result.permissions_for_form);
      } else {
        console.log(response);
      }
    };
    getPermission();
  }, []);

  const onSubmit = async values => {
    const permissions = Object.values(selectedOptions)
      .reduce((f, each) => [...f, ...each], [])
      .map(each => each.value);
    values = { ...values, permissions };
    console.log(values);
    const response = await handleEditPermissionGroup({
      company_id: company,
      instance_id: id,
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
          initialValues={instance}
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

export default EditPermission;
