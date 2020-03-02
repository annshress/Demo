import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";

import Divider from "../../../../commons/divider";
import iconSecure from "../../../../assets/img/icons/secure.png";
import SwitchInput, {
  switchType,
  switchColor
} from "../../../../commons/form_fields/switch_input/SwitchInput";
import DisplayDateTime from "../../../../commons/DisplayDateTime";
import { Field, Form } from "react-final-form";
import { required } from "../../../../commons/validators";
import TextInput from "../../../../commons/form_fields/textInput";
import { handleChangePassword } from "../../../../remote_access/accounts/authentication";
import { generateAndRemoveNotification } from "../../../../store/actionCreators";
import Notification from "../../../notification";
import SetupTwoFactor from "../../authentication/mfa_token/setup";
import SetUpSecurityQuestion from "../../authentication/security_question/index";

function Security(props) {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState(false);
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


  const handleSecurityQuestionChange = e => {
    const newValue = !securityQuestion;
    if (newValue) {
      handleShowSecurityQuestion();
      // setTwoFactorAuth;
    } else {
      const yes = window.confirm(
        "Are you sure you want to disable Security Question?"
      );
      if (yes) {
        setSecurityQuestion(newValue);
        props.disableSecurityQuestion();
      }
    }
  };

  const handleCloseChangePassword = () => setShowChangePassword(false);
  const handleShowChangePassword = () => setShowChangePassword(true);
  const handleCloseSecurityQuestion = () => setShowSecurityQuestion(false);
  const handleShowSecurityQuestion = () => setShowSecurityQuestion(true);
  const handleCloseTwoFactorAuth = () => setShowTwoFactorAuth(false);
  const handleShowTwoFactorAuth = () => setShowTwoFactorAuth(true);

  const onChangePassword = async values => {
    if (values.password !== values.password2) {
      return {
        password2: "Passwords do not match."
      };
    }
    const response = await handleChangePassword({ data: values });
    if (response.ok) {
      setShowChangePassword(false);
      generateAndRemoveNotification(201, "New Password has been set!");
    } else {
      return response;
    }
  };

  return (
    <React.Fragment>
      <div className="wuwp-card">
        <div className="title with-border">
          <h3>Security</h3>
        </div>
        <div className="content">
          <div className="row">
            <Divider type={"blank"} size={"sm"} />
          </div>
          <Table striped>
            <tbody>
              <tr>
                <td className={"align-middle"}>
                  <span>Change Password</span>
                </td>
                <td className={"align-middle text-right"}>
                  <button
                    className="btn btn-info"
                    onClick={handleShowChangePassword}
                  >
                    <img src={iconSecure} alt="" className={"icon-secure"} />
                    Secure
                  </button>
                </td>
              </tr>
              <tr>
                <td className={"align-middle"}>
                  <span>
                    Two Factor Authentication{" "}
                    {twoFactorAuth ? (
                      <React.Fragment>
                        <strong>{twoFactorAuth}</strong>
                        <button
                          className="btn-sm btn-secondary"
                          onClick={() => props.getRecoveryCode()}
                        >
                          Backup Code
                        </button>{" "}
                        <button
                          style={{
                            // position: "absolute",
                            // top: "18px",
                            // right: "18px",
                            // textAlign: "center",
                            backgroundColor: "#8CD8EA",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            fontSize: "16px",
                            // lineHeight: "26px",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                          title="On using backup code, two factor authentication will be disabled. On requesting for more 
                          backup codes will invalidate the older ones."
                        >
                          <strong>&#63;</strong>
                        </button>
                      </React.Fragment>
                    ) : (
                      undefined
                    )}{" "}
                  </span>
                </td>
                <td className={"align-middle text-right"}>
                  <SwitchInput
                    checked={twoFactorAuth}
                    handleChange={handleTwoFactorAuthChange}
                    height={35}
                    width={120}
                    type={switchType.DISABLED_ENABLED}
                    color={switchColor.info}
                  />
                </td>
              </tr>
              <tr>
                <td className={"align-middle"}>
                  <span>Security Question</span>
                </td>
                <td className={"align-middle text-right"}>
                  <SwitchInput
                    checked={securityQuestion}
                    handleChange={handleSecurityQuestionChange}
                    height={35}
                    width={120}
                    type={switchType.DISABLED_ENABLED}
                    color={switchColor.info}
                  />
                </td>
              </tr>
              <tr>
                <td className={"align-middle"}>
                  <span>Last Login</span>
                </td>
                <td className={"align-middle text-right"}>
                  <DisplayDateTime
                    date={props.user.last_login}
                    hAlignment="end"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showChangePassword} onHide={handleCloseChangePassword}>
        <Form
          onSubmit={onChangePassword}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} className="employee_form">
              <Modal.Header closeButton className="bg-primary text-light">
                <Modal.Title>Change Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Notification />
                <div className="row">
                  <div className="col-12">
                    <Field name="old_password" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          type="password"
                          placeholder="Old Password"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Field name="password" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          type="password"
                          placeholder="New Password"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Field name="password2" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          type="password"
                          placeholder="Confirm Password"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-primary"
                  onClick={handleCloseChangePassword}
                >
                  Close
                </Button>
                <button
                  type="submit"
                  name=""
                  className="btn btn-info pl-4 pr-4"
                >
                  Save
                </button>
              </Modal.Footer>
            </form>
          )}
        />
      </Modal>

      <Modal show={showTwoFactorAuth} onHide={handleCloseTwoFactorAuth}>
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title>Setup 2 Factor Authentication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SetupTwoFactor
            setTwoFactorAuth={setTwoFactorAuth}
            handleCloseTwoFactorAuth={handleCloseTwoFactorAuth}
          />
        </Modal.Body>
      </Modal>
      <Modal show={showSecurityQuestion} onHide={handleCloseSecurityQuestion}>
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title>Setup Secuirty Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SetUpSecurityQuestion
            company_id={props.company_id}
            user={props.user}
            setSecurityQuestion={setSecurityQuestion}
            handleCloseSecurityQuestion={handleCloseSecurityQuestion}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default Security;
