/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReactDOM from "react-dom";
import Script from "react-load-script";
import PropTypes from "prop-types";

const PaypalButton = React.forwardRef((props, ref) => {
  window.React = React;
  window.ReactDOM = ReactDOM;

  const { total, currency, customer, client, isLoading } = props;

  const [state, setState] = React.useState({
    isScriptLoaded: false,
    isScriptLoadSucceeded: false
  });

  const Temp = props => {
    return !state.isScriptLoadSucceeded ? (
      <Script
        url={`https://www.paypal.com/sdk/js?client-id=${client}`}
        onCreate={() => {
          setState(old => {
            return { ...old, isScriptLoaded: true };
          });
        }}
        onError={() => {
          alert("Failed to load paypal. Try reloading the page!");
        }}
        onLoad={() => {
          setState(old => {
            return { ...old, isScriptLoadSucceeded: true };
          });
        }}
      />
    ) : (
      <React.Fragment></React.Fragment>
    );
  };

  const paypal = window.paypal;

  const createOrder = (data, actions) => {
    isLoading(true);
    // Set up the transaction
    // paymentData = { paymentIntent: "message" };
    return actions.order.create({
      intent: "capture",
      payer: {
        name: {
          given_name: customer.name.split(" ")[0],
          surname: customer.name
            .split(" ")
            .slice(1)
            .join(" ")
        },
        email_address: customer.email,
        address: {
          address_line_1: customer.address_one,
          address_line_2: customer.address_two,
          admin_area_2: customer.city,
          admin_area_1: customer.state,
          postal_code: customer.zip,
          country_code: "US"
        }
      },
      purchase_units: [
        {
          amount: {
            value: total,
            currency_code: currency.toUpperCase()
          }
        }
      ]
    });
  };

  const onApprove = async (data, actions) => {
    // console.log("onApprove", data, actions);
    console.log("Successful authorization. Verifying order...");
    window.fakeCheckout(window.checkoutData).then(function(ok) {
      if (!ok) {
        alert("Please fix the errors in Order!");
        return;
      }

      // Try to capture the funds from the transaction
      return actions.order.capture().then(function(details) {
        // store the actions to be able to capture.
        // console.log("onCapture", details);
        window.payment = {
          paymentIntent: {
            orderID: data.orderID
          }
        };
        // now submit to server
        window.submitCheckout(window.checkoutData);
        isLoading(false);
      });
    });
  };

  const onError = args => {
    console.log("error", args);
    isLoading(false);
  };

  const onCancel = args => {
    alert("Payment cancelled");
    isLoading(false);
  };

  React.useEffect(() => {
    if (state.isScriptLoadSucceeded) {
      // setState({ showButton: true });
      paypal
        .Buttons({
          createOrder: createOrder,
          onApprove: onApprove,
          onError: onError,
          onCancel: onCancel
        })
        .render("#paypal-button-container");
    }
  }, [state.isScriptLoadSucceeded]);

  const cardSubmit = values => {
    // Capture the funds from the transaction in the server
    return window.payment;
  };

  React.useImperativeHandle(ref, () => ({
    async cardSubmit(values) {
      return cardSubmit(values);
    }
  }));

  return (
    <React.Fragment>
      <div id="paypal-button-container"></div>
      <Temp client={client}></Temp>
    </React.Fragment>
  );
});

PaypalButton.defaultProps = {
  currency: "USD"
};

PaypalButton.propTypes = {
  client: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  currency: PropTypes.string
};

export default PaypalButton;
