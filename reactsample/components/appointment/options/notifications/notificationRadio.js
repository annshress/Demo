import React from "react";
import IosCheckmark from "react-ionicons/lib/IosCheckmark";
import IosCloseCircleOutline from "react-ionicons/lib/IosCloseCircleOutline";
import { Field, Form } from "react-final-form";

import RadioInput from "../../../../commons/form_fields/radio_input/RadioInput";

function NotificationRadio(props) {
  const {
    recipientTypes,
    recipient,
    messageTypes,
    messageType,
    setRadio,
    confirmation,
    payment,
    cancellation,
    notifications
  } = props;

  const statusIcon = status => {
    if (status === true) {
      return <IosCheckmark className={"icon-default icon-left"} />;
    }
    if (status === false) {
      return <IosCloseCircleOutline className={"icon-default icon-left"} />;
    }
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-2 form-fields">
          <label>Recipient</label>
        </div>
        <div className="col-2 form-fields">
          <label>Message Type</label>
        </div>
        <div className="col-2 form-fields">
          <label>Status</label>
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          {recipientTypes.map(recipientType => (
            <div className={"row"} key={recipientType}>
              <div className="col-12 col-recipient-type">
                <RadioInput
                  label={recipientType.toTitle()}
                  value={recipientType.toTitle()}
                  checked={recipient === recipientType}
                  onClick={() =>
                    setRadio(state => {
                      return { ...state, recipient: recipientType };
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="col-2">
          {messageTypes.map(message => (
            <div className={"row"} key={message}>
              <div className="col-12 col-message-type">
                <RadioInput
                  label={message.toTitle()}
                  value={message.toTitle()}
                  checked={message === messageType}
                  onClick={() =>
                    setRadio(state => {
                      return {
                        ...state,
                        messageType: message
                      };
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="col-2">
          <div className="row">
            <div className="col-12 col-status-button">
              <button
                className={`btn ${
                  notifications[confirmation] ? "btn-info" : "btn-secondary"
                }`}
              >
                {statusIcon(notifications[confirmation])}
                Send
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-status-button">
              <button
                className={`btn ${
                  notifications[payment] ? "btn-info" : "btn-secondary"
                }`}
              >
                {statusIcon(notifications[payment])}
                Send
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-status-button">
              <button
                className={`btn ${
                  notifications[cancellation] ? "btn-info" : "btn-secondary"
                }`}
              >
                {statusIcon(notifications[cancellation])}
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default NotificationRadio;
