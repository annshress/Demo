import React from "react";
import { connect } from "react-redux";
import {Alert} from "react-bootstrap";

export function Notification(props) {
  return (
    (props.message && props.ok && (
      <div className={(props.hasContainerFluid ? "container-fluid": "container") + " pl-0 pr-0" + (props.hasMarginLeftRight? '': ' ml-0 mr-0')}>
        <Alert variant="success mt-4">
          <strong>Success!</strong> {props.message}
        </Alert>
      </div>

    )) ||
    (props.message && (
      <div className={(props.hasContainerFluid ? "container-fluid": "container") + " pl-0 pr-0" + (props.hasMarginLeftRight? '': ' ml-0 mr-0')}>
        <Alert variant="danger mt-4">
        <strong>We apologize!</strong> {props.message}
        </Alert>
      </div>

    )) || <div/>
  );
}

Notification.defaultProps = {
  hasContainerFluid: true,
  hasMarginLeftRight: true
};

const mapStateToProps = state => {
  return {
    message: state.notification.message,
    ok: state.notification.ok
  };
};

export default connect(mapStateToProps)(Notification);
