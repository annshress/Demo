import React from "react";
import PropTypes from "prop-types";
import { FormContainer, FormComponent } from "react-authorize-net";

// getting Accept from included accept.js in index.html
const Accept = window.Accept;

const ENVIRONMENT_TYPE = "sandbox";

const CardSection = React.forwardRef((props, ref) => {
  const refCardNumber = React.createRef(null);
  const refExpMonth = React.createRef(null);
  const refExpYear = React.createRef(null);
  const refCardCode = React.createRef(null);

  const { clientKey, apiLoginId } = props;

  const StyledFormComponent = props2 => {
    return (
      <div className={'container-authorized'}>
        <div className="row">
          <div className={`col-${props.col} offset-${props.colOffset}`}>
            <h2 className={'header'}>Card Details</h2>
            <div id="paymentForm" method="POST" action="">
              <input
                type="text"
                name="cardNumber"
                key="cardNumber"
                ref={refCardNumber}
                id="cardNumber"
                placeholder="4111 1111 1111 1111"
              />
              <input
                type="text"
                name="expMonth"
                key="expMonth"
                ref={refExpMonth}
                id="expMonth"
                placeholder="Expiry month e.g: 12"
              />
              <input
                type="text"
                name="expYear"
                key="expYear"
                ref={refExpYear}
                id="expYear"
                placeholder="Expiry year e.g: "
              />
              <input
                type="text"
                name="cardCode"
                key="cardCode"
                ref={refCardCode}
                id="cardCode"
                placeholder="Card code"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const responseHandler = response => {
    if (response.messages.resultCode === "Error") {
      alert(response.messages.message.map(x => x.text).join());
    } else {
      return response.opaqueData;
    }
  };

  const cardSubmit = async values => {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    const authData = {
      apiLoginID: `${apiLoginId}`,
      clientKey: `${clientKey}`
    };
    const cardData = {
      cardCode: refCardCode.current.value,
      cardNumber: refCardNumber.current.value.replace(/\s/g, ""),
      month: refExpMonth.current.value,
      year: refExpYear.current.value
    };

    var secureData = {};
    secureData.authData = authData;
    secureData.cardData = cardData;

    let response = null;
    await Accept.dispatchData(secureData, result_ => {
      response = result_;
    });
    let i = 0;
    while (i < 4) {
      console.log("waiting...");
      await sleep(1000);
      if (response) {
        const result = responseHandler(response);
        return { paymentIntent: result };
      }
      i = i + 1;
    }
    return false;
  };

  React.useImperativeHandle(ref, () => ({
    async cardSubmit(values) {
      return await cardSubmit(values);
    }
  }));

  return (
    <FormContainer
      environment={ENVIRONMENT_TYPE}
      // onError={onErrorHandler}
      // onSuccess={onSuccessHandler}
      amount={Number(props.amount)}
      component={StyledFormComponent}
      clientKey={clientKey}
      apiLoginId={apiLoginId}
    />
    // <Box className="App" p={3}>
    // </Box>
  );
});

CardSection.propTypes = {
  clientKey: PropTypes.string.isRequired,
  apiLoginId: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired
};

export default CardSection;
