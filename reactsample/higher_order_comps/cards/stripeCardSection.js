import React from "react";
import {
  Elements,
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "react-stripe-elements";
import {Alert} from "react-bootstrap";

var globalCardSubmit = async () => {};

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize:'16px',
        color: '#000',
        backgroundColor: '#fff',
        letterSpacing: '0.025em',
        fontFamily: 'Poppins, sans-serif',
        '::placeholder': {
          color: '#939393',
        },
        ...({padding:'6px 10px'}),
      },
      invalid: {
        color: '#d93d41',
      },
    },
  };
};

const CheckoutForm = props => {
  const [cardError, setCardError]=React.useState('');
  const { paymentIntentClientSecret } = props;

  const cardSubmit = async values => {
    // create token  for the given credit card
    const response = await props.stripe.createToken({
      type: "card",
      name: values.client.name
    });
    if (response.error) {
      // Inform the user if there was an error.
      alert(response.error.message);
    } else {
      const data = {
        receipt_email: values.client.email,
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


      // handle card payment
      const paymentResponse = await props.stripe.handleCardPayment(
        paymentIntentClientSecret,
        {},
        data
      );
      if (paymentResponse.paymentIntent) {
        return paymentResponse;
      } else {
        setCardError('<span>Sorry Payment was not succesful.</br>' + paymentResponse.error.message + '</span>');
        setTimeout(()=>{
          setCardError('');
        },5000)
      }
    }
    return false;
  };

  globalCardSubmit = cardSubmit;

  return (
    <div className={'container-stripe'}>
      <div className="row">
        <div className={`col-${props.col} offset-${props.colOffset}`}>
          <h2 className={'header'}>Card Details</h2>
          {cardError !== '' &&
          <Alert variant="danger">
            <div dangerouslySetInnerHTML={{ __html: cardError }}/>
          </Alert>
          }
          {/*<CardElement id="card-element" />*/}
          <label>
            Card Number
          </label>
          <CardNumberElement
            className="form-control card-element"
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
            {...createOptions()}
          />
          <label>
            CVC
          </label>
          <CardCvcElement
            className="form-control card-element"
            {...createOptions()}
          />
        </div>
      </div>
    </div>
  );
};

const InjectedCheckoutForm = injectStripe(CheckoutForm);

const CardSection = React.forwardRef((props, ref) => {
  const { paymentIntentClientSecret,col,colOffset } = props;

  React.useImperativeHandle(ref, () => ({
    async cardSubmit(values) {
      return await globalCardSubmit(values);
    }
  }));

  return (
    <Elements>
      <InjectedCheckoutForm
        col={col}
        colOffset={colOffset}
        paymentIntentClientSecret={paymentIntentClientSecret}
      />
    </Elements>
  );
});

export default CardSection;
