import React from "react";
import { connect } from "react-redux";
import {
  StripeProvider,
  Elements,
  // CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  injectStripe
} from "react-stripe-elements";

import "./payplan.scss";
import SelectFieldInput from "../../../commons/form_fields/selectFieldInput";
import {
  handleGetPaymentClientSecret,
  handleSubscribePayplan,
  handleGetFreeSubscription,
  handleCreateFreeSubscription
} from "../../../remote_access/company/company";
import UnifiedWorkplaceLogo from "../../../assets/img/unified_workplace.png";
import Divider from "../../../commons/divider";
import AccountLayout from "../../layouts/account";
import Notification from "../../notification";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { required } from "../../../commons/validators";

const FREE = 0;
const PAID = 1;

var globalCardSubmit = async () => {};

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: "16px",
        color: "#000",
        backgroundColor: "#fff",
        letterSpacing: "0.025em",
        fontFamily: "Poppins, sans-serif",
        "::placeholder": {
          color: "#939393"
        },
        ...{ padding: "6px 10px" }
      },
      invalid: {
        color: "#d93d41"
      }
    }
  };
};

const CheckoutForm = props => {
  const [cardError, setCardError] = React.useState("");
  const { setupIntentClientSecret } = props;

  const cardSubmit = async () => {
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  return (
    <div className={"container-card-details"}>
      <h2 className={"header"}>Card Details</h2>
      {cardError !== "" && (
        <Alert variant="danger">
          <div dangerouslySetInnerHTML={{ __html: cardError }} />
        </Alert>
      )}
      {/*<CardElement id="card-element" />*/}
      <label>Card Number</label>
      <CardNumberElement
        className="form-control card-element"
        {...createOptions()}
      />
      <label>Expiration date</label>
      <CardExpiryElement
        className="form-control card-element"
        {...createOptions()}
      />
      <label>CVC</label>
      <CardCvcElement
        className="form-control card-element"
        {...createOptions()}
      />
    </div>
  );
};

const InjectedCheckoutForm = injectStripe(CheckoutForm);

const CardSection = React.forwardRef((props, ref) => {
  const { setupIntentClientSecret } = props;

  React.useImperativeHandle(ref, () => ({
    async cardSubmit() {
      return await globalCardSubmit();
    }
  }));

  return (
    <Elements>
      <InjectedCheckoutForm setupIntentClientSecret={setupIntentClientSecret} />
    </Elements>
  );
});
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  const renderDeleteSubscription = () => {
    return (
      <Alert variant="warning">
        You are about to delete your subscription with WhyUnified.
      </Alert>
    );
  };

  const getFreeDetails = async () => {
    const response = await handleGetFreeSubscription();
    if (!response.ok) {
      setShowDelete(true);
      console.log(response.non_field_errors);
    }
  };

  React.useEffect(() => {
    if (state.plan === PAID) {
      getSetiClientSecret();
    }
    if (state.plan === FREE) {
      getFreeDetails();
    }
  }, [state.plan]);

  const cardRef = React.createRef(null);

  return (
    <AccountLayout>
      <React.Fragment>
        <div className="row row-logo">
          <div className="col-12">
            <img src={UnifiedWorkplaceLogo} alt="" />
          </div>
        </div>
        <div className="row">
          <Divider type={"blank"} />
        </div>
        <div className="row">
          <div className="col-12">
            <h2>Subscriptions</h2>
            <p>
              Under paid plan we support Stripe and Authorize.Net connection at
              the moment!
            </p>
          </div>
        </div>

        <Form
          onSubmit={onSubmit}
          render={({
            submitError,
            handleSubmit,
            reset,
            submitting,
            pristine,
            values
          }) => (
            <form onSubmit={handleSubmit} className={"employee_form"}>
              <div className="row">
                <div className="col-12">
                  {submitError && (
                    <React.Fragment>
                      <Alert variant="danger">{submitError}</Alert>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Field name="name" validate={required}>
                    {({ input, meta }) => (
                      <SelectFieldInput
                        name={"subscriptions"}
                        label={"Plan"}
                        options={[
                          { label: "Free ($0/month)", value: FREE },
                          { label: "Paid ($30/month)", value: PAID }
                        ]}
                        _onChange={onChange}
                      />
                    )}
                  </Field>
                </div>
              </div>
              <div className="row">
              ////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

              <div className="row">
                <Divider type="blank" />
              </div>
            </form>
          )}
        />
      </React.Fragment>
    </AccountLayout>
  );
}

function mapStateToProps(state) {
  return {
    company_id: state.account.company_id
  };
}

export default connect(
  mapStateToProps,
  null
)(SubscribePayPlan);
