import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Spinner } from "react-bootstrap";
import { UserAgentApplication } from "msal";

import { handleMicrosoftLogin } from "../../remote_access/accounts/authentication";
import { handleGetUserDetails } from "../../remote_access/accounts/business_account";
import { ACCOUNT_LOGIN } from "../../store/actionTypes";
import { userDetails } from "../../store/actionCreators";

const CLIENT_ID = "...";
const SCOPES = ["user.read"];

function MicrosoftLoginButton(props) {
  const [submitting, setSubmitting] = React.useState(false);

  var msalConfig = {
    auth: {
      clientId: CLIENT_ID
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };

////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  const login = async () => {
    setSubmitting(true);
    try {
      await msalObj.loginPopup({
        scopes: SCOPES,
        prompt: "select_account"
      });
      await getUserDetail();
    } catch (err) {
      var error = {};

      if (typeof err === "string") {
        var errParts = err.split("|");
        error =
          errParts.length > 1
            ? { message: errParts[1], debug: errParts[0] }
            : { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }
      console.log("error", error);
    }
    setSubmitting(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outline-primary"
        size={"sm"}
        onClick={() => login()}
        block
        disabled={submitting}
        type={"submit"}
        className={"with-spinner-right"}
      >
        {submitting && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        <img
          src="data:image/png;base64,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"
          height="30"
        ></img>{" "}
        Sign {props.signin ? "in" : "up"} with Microsoft
      </Button>
    </React.Fragment>
  );
}

MicrosoftLoginButton.defaultProps = {
  signin: true
};

const mapDispatchToProps = dispatch => {
  return {
    login: data => dispatch({ type: ACCOUNT_LOGIN, payload: data })
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MicrosoftLoginButton);
