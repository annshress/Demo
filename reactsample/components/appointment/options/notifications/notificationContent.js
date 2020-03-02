import React, { useState } from "react";
import {Alert,Card} from 'react-bootstrap';

import NotificationRadio from "./notificationRadio";
import NotificationEmailForm from "./notificationEmailForm";
import Divider from "../../../../commons/divider";

const KEYS = {
  client: {
    confirmation: {
      subject: "client_new_order_email_subject",
      body: "client_new_order_email",
      flag: "send_client_new_order_email"
    },
    payment: {
      subject: "client_payment_confirm_email_subject",
      body: "client_payment_confirm_email",
      flag: "send_client_payment_confirm_email"
    },
    cancellation: {
      subject: "client_cancel_email_subject",
      body: "client_cancel_email",
      flag: "send_client_cancel_email"
    }
  },
  employee: {
    confirmation: {
      subject: "employee_new_order_email_subject",
      body: "employee_new_order_email",
      flag: "send_employee_new_order_email"
    },
    payment: {
      subject: "employee_payment_confirm_email_subject",
      body: "employee_payment_confirm_email",
      flag: "send_employee_payment_confirm_email"
    },
    cancellation: {
      subject: "employee_cancel_email_subject",
      body: "employee_cancel_email",
      flag: "send_employee_cancel_email"
    }
  }
};

function NotificationContent(props) {
  const { notifications, onSubmit } = props;

  const [radio, setRadio] = useState({
    recipientTypes: ["client", "employee"],
    recipient: "client",
    messageTypes: ["confirmation", "payment", "cancellation"],
    messageType: "confirmation"
  });

  const getEmailKeys = () => {
    if (Object.keys(notifications).length >= 1) {
      return {
        emailFlagKey: KEYS[radio.recipient][radio.messageType]["flag"],
        emailSubjectKey: KEYS[radio.recipient][radio.messageType]["subject"],
        emailBodyKey: KEYS[radio.recipient][radio.messageType]["body"]
      };
    } else {
      return {
        emailFlagKey: "",
        emailSubjectKey: "",
        emailBodyKey: ""
      };
    }
  };

  const getEmailFlagKeys = () => {
    if (Object.keys(notifications).length >= 1) {
      return {
        confirmation: KEYS[radio.recipient]["confirmation"]["flag"],
        payment: KEYS[radio.recipient]["payment"]["flag"],
        cancellation: KEYS[radio.recipient]["cancellation"]["flag"]
      };
    } else {
      return {
        confirmation: "",
        payment: "",
        cancellation: ""
      };
    }
  };

  return(
    <div className={'employee_form'}>
      <div className="row">
        <div className="col-12">
          <Alert variant="secondary">
            <Alert.Heading>Notification</Alert.Heading>
            <p>
              Automated messages are sent both to client and employees(s) on
              specific events. Select message type to edit it - enable/disable or
              just change message text. For SMS notifications you need to enable SMS
              service. See more here.
            </p>
          </Alert>
        </div>
      </div>
      <div className="row">
        <Divider type={'blank'}/>
      </div>
      <NotificationRadio
        {...radio}
        {...getEmailFlagKeys()}
        setRadio={setRadio}
        notifications={notifications}
      />
      <div className="row">
        <Divider type={'blank'}/>
      </div>
      <div className="row">
        <div className="col-8">
          <Alert variant="secondary">
            <Alert.Heading>
              Booking {radio.messageType.toTitle()} email sent to{" "}
              {radio.recipient.toTitle()}
            </Alert.Heading>
            <p>
              This email is sent to {radio.recipient} when booking{" "}
              {radio.messageType} is made.
            </p>
          </Alert>

          <NotificationEmailForm
            {...getEmailKeys()}
            notifications={notifications}
            onSubmit={onSubmit}
          />
        </div>

        <div className="col-4">
          <Card className={'card-secondary card-token'}>
            <Card.Header>
              <h3>Available tokens</h3>
              <p>
                Personalize the message by including any of the available
                tokens and it will be replaced with corresponding data.
              </p>
            </Card.Header>
            <Card.Body>
              <div className="token_list">
                <ul>
                  <li>uuid (BookingID)</li>
                  <li>company</li>
                  <li>c_name</li>
                  <li>c_contact</li>
                  <li>c_email</li>
                  <li>c_notes</li>
                  <li>c_address_one</li>
                  <li>c_address_two</li>
                  <li>c_city</li>
                  <li>c_state</li>
                  <li>c_zip</li>
                  <li>c_country</li>
                  <li>services</li>
                  <li>payment</li>
                  <li>price</li>
                  <li>deposit</li>
                  <li>tax</li>
                  <li>total</li>
                  <li>cancel_url</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NotificationContent;
