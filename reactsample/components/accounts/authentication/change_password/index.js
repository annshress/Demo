import React from "react";

import Content from "../../../layouts/content";
import ChangePasswordForm from "./changePasswordForm";

import { generateAndRemoveNotification } from "../../../../store/actionCreators";
import { handleChangePassword } from "../../../../remote_access/accounts/authentication";

function ChangePassword(props) {
  const onSubmit = async values => {
    if (values.password !== values.password2) {
      return {
        password2: "Passwords do not match."
      };
    }
    const response = await handleChangePassword({ data: values });
    if (response.ok) {
      generateAndRemoveNotification(201, "New Password has been set!");
    } else {
      return response;
    }
  };

  return (
    <Content>
      <ChangePasswordForm onSubmit={onSubmit} />
    </Content>
  );
}

export default ChangePassword;
