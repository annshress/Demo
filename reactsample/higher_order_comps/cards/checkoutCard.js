/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PropTypes from "prop-types";
import { StripeProvider } from "react-stripe-elements";

import "./style.scss";

import StripeCardSection from "./stripeCardSection";
import AuthorizeCardSection from "./authorizecardSection";

import { CREDIT_CARD } from "../../components/business/constants";

import {
  handleGetStripeDetails,
  handleGetAuthorizeDetails,
  handleGetPaypalDetails
} from "../../remote_access/appointment/bookings";
import { handleFetchCompanyPayPlan } from "../../remote_access/company/company";
import PaypalCardSection from "./paypalCardSection";

/**
 * WithCard component takes in two arguments: `Wrappedcomponent` as first and `props` as its second argument
 *
 *
 * The `props` (of WithCard) should bear following properties:
 * - company: Id of the company
 * - getAmount: func to get amount to be collected from the customer, which is implemented in the
 *              wrapping main component that returns WithCard component.
 * - getCurrency: just like above but for currency
 * - getCustomer: just like above but for customer (object)
 *
 * Remaining attributes are simply passed back to the wrapped component.
 *
 *
 * `WrappedComponent` on the other hand should expect following `props`:
 * - onPaymentChange: a func to be called when payment choice changes, this inturn calls
 *                    decides whether to show `Card Section` or not.
 * - cardSubmit: a func that should be called when payment from the customer is expected,
 *               usually on checkouts/form-submits.
 * - isLoading: a func to set the `loading` parameter below.
 * - loading: a bool that disables/enables the checkout/submit buttons while the
 *            payment is being processed, so that multiple payments are prevented.
 *
 */
function WithCard(WrappedComponent, props) {
  const {
    company,
    getAmount,
    getCurrency,
    getCustomer,
    cardFormColSize,
    cardFormColOffset
  } = props;
  const col = cardFormColSize || 12;
  const colOffset = cardFormColOffset || 0;

  const [state, setState] = React.useState({
    gateway: "",
    loading: false,
    // # stripe
    STRIPE_PUBLIC_KEY: "",
    stripeAccount: "",
    paymentIntentClientSecret: "",
    // # authorize.net
    clientKey: "",
    apiLoginId: "",
    // paypal
    paypal_client: undefined
  });

  React.useEffect(() => {
    const getCompanyPayGateway = async () => {
      const response = await handleFetchCompanyPayPlan({
        company: company
      });
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
});
      }
    };
    getCompanyPayGateway();
  }, []);

  const showCardSection = () => {
    const getPaymentDetails = async () => {
      const data = {
        amount: getAmount(),
        currency: getCurrency() || "usd" // FIXME: get this from COMPANY options
      };
      // const getGatewayDetails = undefined;
      if (data.amount > 1) {
        if (state.gateway === "authorize") {
          const response = await handleGetAuthorizeDetails({
            company: company,
            data: data
          });
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

        } else if (state.gateway === "stripe") {
          const response = await handleGetStripeDetails({
            company: company,
            data: data
          });
          if (response.ok) {
            setState(old => {
              return {
                ...old,
                STRIPE_PUBLIC_KEY: response.result.stripe_public_key,
                stripeAccount: response.result.stripe_account,
                paymentIntentClientSecret:
                  response.result.payment_intent_client_secret
              };
            });
          }
        } else if (state.gateway === "paypal") {
          const response = await handleGetPaypalDetails({
            company: company
          });
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
        } else {
          alert("Credit Card payment is not yet supported by this company!");
        }
      }
    };
    getPaymentDetails();
  };

  const isLoading = value => {
    setState(old => {
      return {
        ...old,
        loading: value
      };
    });
  };

  const cardRef = React.useRef(null);

  const cardSubmit = async values => {
    return await cardRef.current.cardSubmit(values);
  };

  const onPaymentChange = e => {
    if (e.value === CREDIT_CARD) {
      showCardSection();
    } else {
      setState(old => {
        return {
          ...old,
          loading: false,
          // # stripe
          STRIPE_PUBLIC_KEY: "",
          stripeAccount: "",
          paymentIntentClientSecret: "",
          // # authorize.net
          clientKey: "",
          apiLoginId: "",
          // paypal
          paypal_client: undefined
        };
      });
    }
  };

  return (
    <div>
      <WrappedComponent
        {...props}
        onPaymentChange={onPaymentChange}
        cardSubmit={cardSubmit}
        isLoading={isLoading}
        loading={state.loading}
      />
      {state.stripeAccount && (
        <StripeProvider
          apiKey={state.STRIPE_PUBLIC_KEY}
          stripeAccount={state.stripeAccount}
        >
          <StripeCardSection
            col={col}
            colOffset={colOffset}
            paymentIntentClientSecret={state.paymentIntentClientSecret}
            ref={cardRef}
          />
        </StripeProvider>
      )}
      {state.apiLoginId && (
        <AuthorizeCardSection
          clientKey={state.clientKey}
          apiLoginId={state.apiLoginId}
          amount={getAmount()}
          ref={cardRef}
          col={col}
          colOffset={colOffset}
        />
      )}
      {state.paypal_client && (
        <PaypalCardSection
          client={state.paypal_client}
          total={getAmount()}
          currency={getCurrency()}
          customer={getCustomer()}
          isLoading={isLoading}
          ref={cardRef}
        />
      )}
    </div>
  );
}

WithCard.propTypes = {
  company: PropTypes.string.isRequired,
  getAmount: PropTypes.func.isRequired,
  getCurrency: PropTypes.func,
  cardFormColOffset: PropTypes.number,
  cardFormColSize: PropTypes.number
};

export default WithCard;
