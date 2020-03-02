import React from "react";
import Select from "react-select";

import SetupSMS from "./setupSMS";
import SetupQRCode from "./setupQRCode";

function SetupTwoFactor(props) {
  const { setTwoFactorAuth, handleCloseTwoFactorAuth } = props;

  const [state, setState] = React.useState({
    options: [
      { label: "--Select--", value: null },
      { label: "SMS", value: "sms" },
      { label: "QRCODE", value: "qrcode" }
    ],
    selected: null
  });

  var SetupForm;

  if (state.selected === "sms") {
    SetupForm = SetupSMS;
  } else if (state.selected === "qrcode") {
    SetupForm = SetupQRCode;
  }
  return (
    <React.Fragment>
      <h3>Select the authentication method:</h3>
      <Select
        options={state.options}
        onChange={option => {
          setState(old => {
            return { ...old, selected: option.value };
          });
        }}
      ></Select>
      <p>Selected method for two factor authentication: {state.selected}</p>
      {SetupForm ? (
        <SetupForm
          setTwoFactorAuth={setTwoFactorAuth}
          handleCloseTwoFactorAuth={handleCloseTwoFactorAuth}
        />
      ) : (
        undefined
      )}
    </React.Fragment>
  );
}

export default SetupTwoFactor;
